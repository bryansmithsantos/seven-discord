
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

    execute(ctx: any, ...args: string[]) {
        // args might be split, join them back first?
        // But if we support complex structures, we should treat the whole input as one block usually.
        // Or re-join with space.
        const content = args.join(" ");
        if (!content) return;

        const payload: any = {
            content: ""
        };

        let processedContent = content;

        // 1. Extract Embeds
        // Syntax: <<EMBED>>JSON
        const embedMatch = processedContent.match(/<<EMBED>>(.*?)(?:$|(?=COMPONENT_|<<EMBED>>))/s);
        // Simple regex might strict. Let's assume one embed for now or loop?
        // Let's loop for multiple embeds? Discord allows 10.

        const embeds = [];
        const embedRegex = /<<EMBED>>(.*?)(?=(?:<<EMBED>>|COMPONENT_|$))/gs;
        let em;
        while ((em = embedRegex.exec(processedContent)) !== null) {
            try {
                const jsonStr = em[1].trim();
                embeds.push(JSON.parse(jsonStr));
            } catch (e: any) {
                Logger.error(`Failed to parse embed JSON: ${e.message}`);
                Logger.error(`Problematic String: "${em[1]}"`);
            }
        }
        if (embeds.length > 0) payload.embeds = embeds;

        // Remove embed strings from content for the final text message
        processedContent = processedContent.replace(/<<EMBED>>.*?(?=(?:<<EMBED>>|COMPONENT_|$))/gs, "");


        // 2. Extract Components (Rows)
        // Syntax: COMPONENT_ROW::JSON::END
        const components = [];
        const compRegex = /COMPONENT_ROW::(.*?)::END/gs;
        let cm;
        while ((cm = compRegex.exec(processedContent)) !== null) {
            try {
                components.push(JSON.parse(cm[1]));
            } catch (e) { Logger.error("Failed to parse component JSON"); }
        }
        if (components.length > 0) payload.components = components;

        // Remove component strings
        processedContent = processedContent.replace(/COMPONENT_ROW::.*?::END/gs, "");


        // 3. Remaining content is the text message
        payload.content = processedContent.trim();

        if (!payload.content && !payload.embeds && !payload.components) return; // Nothing to send?

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
