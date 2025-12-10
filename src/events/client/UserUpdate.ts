
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class UserUpdateEvent extends Event {
    constructor() { super({ name: "USER_UPDATE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`User Updated: ${d.username}`); }
}
