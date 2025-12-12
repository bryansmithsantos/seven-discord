
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class MessageUpdateEvent extends Event {
    constructor() { super({ name: "MESSAGE_UPDATE" }); }
    async execute(client: SevenClient, d: any) {
        Logger.debug(`Message Updated: ${d.id}`);

        const commands = client.eventCommands.get("messageupdate");
        if (!commands) return;

        for (const cmd of commands) {
            await client.interpreter.parse(cmd.code, {
                client: client,
                rest: client.rest,
                message: d, // Pass updated message data
                guildId: d.guild_id,
                channelId: d.channel_id,
                author: d.author
            });
        }
    }
}
