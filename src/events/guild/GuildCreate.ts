
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class GuildCreateEvent extends Event {
    constructor() { super({ name: "GUILD_CREATE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`Joined Guild: ${d.name}`); }
}
