
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class GuildBanRemoveEvent extends Event {
    constructor() { super({ name: "GUILD_BAN_REMOVE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`User Unbanned: ${d.user.id}`); }
}
