
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class RoleUpdateEvent extends Event {
    constructor() { super({ name: "GUILD_ROLE_UPDATE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`Role Updated: ${d.role.name}`); }
}
