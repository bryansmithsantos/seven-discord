import { SevenClient } from "../core/SevenClient";
import { Logger } from "../util/Logger";

export interface VoiceConnection {
    guildId: string;
    channelId: string | null;
    selfMute: boolean;
    selfDeaf: boolean;
    sessionId?: string;
    endpoint?: string;
    token?: string;
    udpParam?: any; // For future UDP connection
}

export class VoiceManager {
    client: SevenClient;
    connections: Map<string, VoiceConnection>;

    constructor(client: SevenClient) {
        this.client = client;
        this.connections = new Map();
    }

    /**
     * Join a voice channel
     * @param guildId relative guild
     * @param channelId voice channel id
     */
    public joinVoiceChannel(guildId: string, channelId: string, selfMute: boolean = false, selfDeaf: boolean = true) {
        Logger.info(`[Voice] Joining channel ${channelId} in guild ${guildId}...`);

        // Store initial intent
        this.connections.set(guildId, {
            guildId,
            channelId,
            selfMute,
            selfDeaf
        });

        // Send Opcode 4
        this.client.gateway.send({
            op: 4, // Voice State Update
            d: {
                guild_id: guildId,
                channel_id: channelId,
                self_mute: selfMute,
                self_deaf: selfDeaf
            }
        });
    }

    /**
     * Leave a voice channel
     */
    public leaveVoiceChannel(guildId: string) {
        if (!this.connections.has(guildId)) return;

        Logger.info(`[Voice] Leaving guild ${guildId}...`);

        this.client.gateway.send({
            op: 4,
            d: {
                guild_id: guildId,
                channel_id: null
            }
        });

        this.connections.delete(guildId);
    }

    /**
     * Handle VOICE_STATE_UPDATE
     * Contains session_id
     */
    public handleVoiceStateUpdate(data: any) {
        if (data.user_id !== this.client.user?.id) return;

        const connection = this.connections.get(data.guild_id);
        if (connection) {
            connection.sessionId = data.session_id;
            connection.channelId = data.channel_id;

            if (!data.channel_id) {
                // We were disconnected
                this.connections.delete(data.guild_id);
                Logger.info(`[Voice] Disconnected from ${data.guild_id}`);
            } else {
                Logger.debug(`[Voice] Session ID received for ${data.guild_id}`);
            }
        }
    }

    /**
     * Handle VOICE_SERVER_UPDATE
     * Contains endpoint and token. Ready for UDP.
     */
    public handleVoiceServerUpdate(data: any) {
        const connection = this.connections.get(data.guild_id);
        if (connection) {
            connection.token = data.token;
            connection.endpoint = data.endpoint;

            Logger.success(`[Voice] Connection Established for ${data.guild_id}! (Ready for UDP)`);
            Logger.debug(`[Voice] Endpoint: ${data.endpoint}`);

            // In a real native client, here we would:
            // 1. Connect WebSocket to `wss://${endpoint}`
            // 2. Perform Handshake (Op 0)
            // 3. Connect UDP
            // 4. Start Encryption (Sodium)
        }
    }
}
