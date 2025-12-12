

import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class RoleUpdateEvent extends Event {
    constructor() { super({ name: "GUILD_ROLE_UPDATE" }); }
    async execute(client: SevenClient, d: any) {
        Logger.debug(`Role Updated: ${d.role?.id || d.id}`);

        const commands = client.eventCommands.get("roleupdate");
        if (!commands) return;

        for (const cmd of commands) {
            await client.interpreter.parse(cmd.code, {
                client: client,
                rest: client.rest,
                message: null,
                guildId: d.guild_id
            });
        }
    }
}
