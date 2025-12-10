import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class GuildMemberAddEvent extends Event {
    constructor() {
        super({ name: "GUILD_MEMBER_ADD" });
    }

    async execute(client: SevenClient, d: any) {
        // d is the member object with user info
        Logger.debug(`Member Joined: ${d.user.username}`);

        // Future: Execute "Welcome" macros here?
        // client.interpreter.runMacro("welcome", ...);
    }
}
