
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class VoiceStateUpdateEvent extends Event {
    constructor() { super({ name: "VOICE_STATE_UPDATE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`Voice State Update: ${d.user_id}`); }
}
