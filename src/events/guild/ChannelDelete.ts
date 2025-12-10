
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class ChannelDeleteEvent extends Event {
    constructor() { super({ name: "CHANNEL_DELETE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`Channel Deleted: ${d.name}`); }
}
