
import { Macro } from "../Macro";
import { Logger } from "../../util/Logger";

export class ReplyMacro extends Macro {
    constructor() {
        super({
            name: "reply",
            description: "Responds to the message author with optionals embeds/components.",
            category: "core"
        });
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
