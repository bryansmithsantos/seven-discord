
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class GuildBanAddEvent extends Event {
    constructor() { super({ name: "GUILD_BAN_ADD" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`User Banned: ${d.user.id}`); }
}
