
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class MessageDeleteEvent extends Event {
    constructor() { super({ name: "MESSAGE_DELETE" }); }
    async execute(client: SevenClient, d: any) {
        Logger.debug(`Message Deleted: ${d.id}`);

        const commands = client.eventCommands.get("messagedelete");
        if (!commands) return;

        for (const cmd of commands) {
            await client.interpreter.parse(cmd.code, {
                client: client,
                rest: client.rest,
                message: d, // Pass deleted message data as context
                guildId: d.guild_id,
                channelId: d.channel_id,
                // Author logic might fail if not cached, but we pass what we have
                author: d.author
            });
        }
    }
}
