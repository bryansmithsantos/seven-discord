
import { Macro } from "../Macro";
import { Logger } from "../../util/Logger";
import { EmbedParser } from "../../util/EmbedParser";

export class ReplyMacro extends Macro {
    constructor() {
        super({
            name: "reply",
            description: "Responds to the message author with optionals embeds/components.",
            category: "core"
        });
    }

    static parsePayload(content: string) {
        const payload: any = { content: "" };
        let processedContent = content;
        const embeds = [];
        const components: any[] = [];

        // 0. Base64 Safe Transport (New Standard)
        const b64Regex = /<<B64_EMBED>>(.*?)::END/gs;
        let b64m;
        while ((b64m = b64Regex.exec(processedContent)) !== null) {
            try {
                const raw = Buffer.from(b64m[1], "base64").toString("utf-8");
                const data = JSON.parse(raw);
                if (data.embed && Object.keys(data.embed).length > 0) embeds.push(data.embed);

                // Handle Base64 Components
                if (data.components && Array.isArray(data.components) && data.components.length > 0) {
                    const comps = data.components;
                    // Wrap if needed (assuming loose buttons if type != 1)
                    if (comps[0].type !== 1) {
                        components.push({ type: 1, components: comps });
                    } else {
                        components.push(...comps);
                    }
                }
            } catch (e) { }
        }
        processedContent = processedContent.replace(/<<B64_EMBED>>.*?::END/gs, "");

        // 1. Extract Embeds (Legacy & Fallback)
        const embedRegex = /<<EMBED>>(.*?)(?=(?:<<EMBED>>|<<COMPONENTS>>|COMPONENT_|$))/gs;
        let em;
        while ((em = embedRegex.exec(processedContent)) !== null) {
            try {
                embeds.push(JSON.parse(em[1].trim()));
            } catch (e) { }
        }
        processedContent = processedContent.replace(/<<EMBED>>.*?(?=(?:<<EMBED>>|<<COMPONENTS>>|COMPONENT_|$))/gs, "");

        // 1.5 Implicit Embeds (s.title used without s.embed)
        // If the user forgot s.embed[], we pick up the loose tags here.
        const { embed: implicitEmbed, cleanContent } = EmbedParser.parse(processedContent);
        if (implicitEmbed) {
            embeds.push(implicitEmbed);
            processedContent = cleanContent; // Remove the tags from content
        }

        if (embeds.length > 0) payload.embeds = embeds;

        // 2. Extract Hoisted Components (from Embeds - Legacy)
        const hoistedRegex = /<<COMPONENTS>>(.*?)(?=(?:<<EMBED>>|COMPONENT_|$))/gs;
        let hm;
        while ((hm = hoistedRegex.exec(processedContent)) !== null) {
            try {
                const list = JSON.parse(hm[1]);
                if (Array.isArray(list) && list.length > 0) {
                    const row = { type: 1, components: list };
                    components.push(row);
                }
            } catch (e) { }
        }
        processedContent = processedContent.replace(/<<COMPONENTS>>.*?(?=(?:<<EMBED>>|COMPONENT_|$))/gs, "");

        // 3. Extract Components (Manual Rows)
        const compRegex = /COMPONENT_ROW::(.*?)::END/gs;
        let cm;
        while ((cm = compRegex.exec(processedContent)) !== null) {
            try {
                components.push(JSON.parse(cm[1]));
            } catch (e) { }
        }
        processedContent = processedContent.replace(/COMPONENT_ROW::.*?::END/gs, "");

        // 4. Auto-Wrap Loose Components (Buttons/Selects) into a new Row
        const looseCompResult = [];
        // Regex to find individual buttons/selects not inside a row
        const btnRegex = /COMPONENT_BUTTON::(.*?)::END/gs;
        const selRegex = /COMPONENT_SELECT::(.*?)::END/gs;

        let bM;
        while ((bM = btnRegex.exec(processedContent)) !== null) {
            try { looseCompResult.push(JSON.parse(bM[1])); } catch (e) { }
        }
        processedContent = processedContent.replace(/COMPONENT_BUTTON::.*?::END/gs, "");

        let sM;
        while ((sM = selRegex.exec(processedContent)) !== null) {
            try { looseCompResult.push(JSON.parse(sM[1])); } catch (e) { }
        }
        processedContent = processedContent.replace(/COMPONENT_SELECT::.*?::END/gs, "");

        if (looseCompResult.length > 0) {
            // Chunk into rows of 5 for buttons (Selects usually take full row, but we'll pack them for now or let Discord error if mixed invalidly)
            // Ideally Selects should be on their own row.
            // Simple logic: If select present, new row. If buttons, chunks of 5.

            let currentChunk = [];
            for (const comp of looseCompResult) {
                if (comp.type === 3 || comp.type === 5 || comp.type === 6 || comp.type === 7 || comp.type === 8) { // Select Menus
                    if (currentChunk.length > 0) {
                        components.push({ type: 1, components: currentChunk });
                        currentChunk = [];
                    }
                    components.push({ type: 1, components: [comp] });
                } else {
                    currentChunk.push(comp);
                    if (currentChunk.length >= 5) {
                        components.push({ type: 1, components: currentChunk });
                        currentChunk = [];
                    }
                }
            }
            if (currentChunk.length > 0) {
                components.push({ type: 1, components: currentChunk });
            }
        }

        if (components.length > 0) payload.components = components;

        // 4. Remaining content
        payload.content = processedContent.trim();
        return payload;
    }

    execute(ctx: any, ...args: string[]) {
        const content = args.join(" ");
        if (!content) return;

        const payload = ReplyMacro.parsePayload(content);
        if (!payload.content && !payload.embeds && !payload.components) return;

        // Send Logic
        if (ctx.interaction) {
            ctx.client.rest.post(`/interactions/${ctx.interaction.id}/${ctx.interaction.token}/callback`, {
                type: 4,
                data: payload
            });
        } else if (ctx.message && ctx.message.channel_id) {
            payload.message_reference = { message_id: ctx.message.id };
            ctx.client.rest.post(`/channels/${ctx.message.channel_id}/messages`, payload);
        }
    }
}
