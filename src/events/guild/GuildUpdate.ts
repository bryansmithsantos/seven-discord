
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class GuildUpdateEvent extends Event {
    constructor() { super({ name: "GUILD_UPDATE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`Guild Updated: ${d.name}`); }
}
