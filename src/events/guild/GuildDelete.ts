
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class GuildDeleteEvent extends Event {
    constructor() { super({ name: "GUILD_DELETE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`Left Guild: ${d.id}`); }
}
