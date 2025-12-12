

import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class ChannelUpdateEvent extends Event {
    constructor() { super({ name: "CHANNEL_UPDATE" }); }
    async execute(client: SevenClient, d: any) {
        Logger.debug(`Channel Updated: ${d.id}`);

        const commands = client.eventCommands.get("channelupdate");
        if (!commands) return;

        for (const cmd of commands) {
            await client.interpreter.parse(cmd.code, {
                client: client,
                rest: client.rest,
                message: null,
                guildId: d.guild_id,
                channelId: d.id,
            });
        }
    }
}
