
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class InteractionCreateEvent extends Event {
    constructor() {
        super({ name: "INTERACTION_CREATE" });
    }

    async execute(client: SevenClient, d: any) {
        // Handle Slash Commands (Type 2)
        if (d.type === 2) {
            const cmdName = d.data.name;
            const cmd = client.slash.commands.get(cmdName);

            if (!cmd) return;

            const context = {
                client: client,
                rest: client.rest,
                guildId: d.guild_id,
                channelId: d.channel_id,
                author: d.member?.user || d.user,
                member: d.member,
                interaction: {
                    id: d.id,
                    token: d.token,
                    type: d.type
                }
            };

            await client.interpreter.parse(cmd.code, context);
            return;
        }

        // Handle Message Component Interactions (Type 3) - Buttons, Selects
        if (d.type === 3) {
            const customId = d.data.custom_id;
            const code = client.interactions.getCode(customId);

            if (code) {
                const ctx = {
                    client: client,
                    rest: client.rest,
                    interaction: d,
                    message: d.message,
                    guildId: d.guild_id,
                    author: d.member ? d.member.user : d.user
                };

                try {
                    await client.interpreter.parse(code, ctx);
                } catch (err: any) {
                    Logger.error(`Error executing interaction ${customId}: ${err.message}`);
                }
            } else {
                Logger.warn(`No code found for interaction: ${customId}`);
            }
        }
    }
}
