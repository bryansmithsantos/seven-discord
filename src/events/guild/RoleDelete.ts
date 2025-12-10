
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class RoleDeleteEvent extends Event {
    constructor() { super({ name: "GUILD_ROLE_DELETE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`Role Deleted: ${d.role_id}`); }
}
