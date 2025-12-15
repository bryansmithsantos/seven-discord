import { Event } from "../../structures/Event";

export class VoiceServerUpdateEvent extends Event {
    constructor() {
        super({
            name: "VOICE_SERVER_UPDATE",
            once: false
        });
    }

    async execute(client: any, data: any) {
        client.voice.handleVoiceServerUpdate(data);
    }
}
