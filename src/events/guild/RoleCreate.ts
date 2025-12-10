
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class RoleCreateEvent extends Event {
    constructor() { super({ name: "GUILD_ROLE_CREATE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`Role Created: ${d.role.name}`); }
}
