import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class GuildMemberRemoveEvent extends Event {
    constructor() {
        super({ name: "GUILD_MEMBER_REMOVE" });
    }

    async execute(client: SevenClient, d: any) {
        Logger.debug(`Member Left: ${d.user.username}`);
    }
}
