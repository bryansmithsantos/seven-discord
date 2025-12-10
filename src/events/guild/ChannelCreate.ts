
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class ChannelCreateEvent extends Event {
    constructor() { super({ name: "CHANNEL_CREATE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`Channel Created: ${d.name}`); }
}
