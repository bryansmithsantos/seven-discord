
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class ReadyEvent extends Event {
    constructor() {
        super({
            name: "READY",
            once: true
        });
    }

    execute(client: SevenClient, data: any) {
        // data comes from the READY dispatch packet
        Logger.success(`[EVENT SYSTEM] Logged in as ${data.user.username}#${data.user.discriminator} (ID: ${data.user.id})`);
        Logger.info(`Seven-Discord is ready! Connected as ${data.user.username} (${data.user.id})`);
    }
}
