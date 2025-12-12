
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class RoleDeleteEvent extends Event {
    constructor() { super({ name: "GUILD_ROLE_DELETE" }); }
    async execute(client: SevenClient, d: any) {
        Logger.debug(`Role Deleted: ${d.role_id || d.id}`);

        const commands = client.eventCommands.get("roledelete");
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
