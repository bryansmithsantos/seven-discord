
import { Macro } from "../Macro";
import { Logger } from "../../util/Logger";

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

        // 1. Extract Embeds
        const embeds = [];
        // Fixed Regex: Lookahead must include <<COMPONENTS>>
        const embedRegex = /<<EMBED>>(.*?)(?=(?:<<EMBED>>|<<COMPONENTS>>|COMPONENT_|$))/gs;
        let em;
        while ((em = embedRegex.exec(processedContent)) !== null) {
            try {
                embeds.push(JSON.parse(em[1].trim()));
            } catch (e) { }
        }
        if (embeds.length > 0) payload.embeds = embeds;
        processedContent = processedContent.replace(/<<EMBED>>.*?(?=(?:<<EMBED>>|<<COMPONENTS>>|COMPONENT_|$))/gs, "");

        // 2. Extract Hoisted Components (from Embeds)
        const components: any[] = [];
        // Fixed Regex: Lookahead for clarity (though usually at end)
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
        if (components.length > 0) payload.components = components;
        processedContent = processedContent.replace(/COMPONENT_ROW::.*?::END/gs, "");

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
