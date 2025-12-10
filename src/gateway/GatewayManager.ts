/**
 * Gateway Manager
 * Handles the persistent WebSocket connection to Discord.
 */

import EventEmitter from "node:events";
import { Constants } from "../core/Constants";
import { Logger } from "../util/Logger";

export class GatewayManager extends EventEmitter {
    private ws: WebSocket | null = null;
    private token: string;
    private heartbeatInterval: Timer | null = null;
    private lastSequence: number | null = null;
    private sessionId: string | null = null;
    public intents: number = 0;

    constructor(token: string) {
        super();
        this.token = token;
    }

    private reconnecting: boolean = false;

    public connect(): void {
        if (this.ws?.readyState === WebSocket.OPEN) return;

        Logger.info(`Connecting to ${Constants.GATEWAY_URL}...`);
        this.ws = new WebSocket(Constants.GATEWAY_URL);

        this.ws.onopen = () => {
            Logger.success("WebSocket connection opened.");
            this.reconnecting = false;
        };

        this.ws.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data.toString());
                this.handlePayload(payload);
            } catch (e) {
                Logger.error("Failed to parse gateway message", e);
            }
        };

        this.ws.onclose = (event) => {
            if (this.reconnecting) return;
            Logger.warn(`Connection closed: ${event.code} - ${event.reason || "Unknown"}`);

            // Handle specific close codes
            if (event.code === 4004) {
                Logger.error("Invalid Token! Please check your credentials.");
                process.exit(1);
            }
            if (event.code === 4010 || event.code === 4011 || event.code === 4012) {
                Logger.error("Invalid Sharding/Intents configuration.");
                process.exit(1);
            }

            this.reconnect();
        };

        this.ws.onerror = (err) => {
            Logger.error("WebSocket Error", err);
            // Reconnect will stem from onclose
        };
    }

    private reconnect() {
        if (this.reconnecting) return;
        this.reconnecting = true;

        // Exponential backoff or simple delay
        const delay = 5000;
        Logger.info(`Reconnecting in ${delay / 1000}s...`);

        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

        setTimeout(() => {
            this.connect();
        }, delay);
    }

    private handlePayload(payload: any): void {
        const { op, t, d, s } = payload;

        if (s) this.lastSequence = s;

        // Op 10: Hello
        if (op === Constants.OPCODES.HELLO) {
            this.startHeartbeat(d.heartbeat_interval);

            // Resume if we have a session, otherwise Identify
            if (this.sessionId && this.lastSequence) {
                this.resume();
            } else {
                this.identify();
            }
        }

        // Op 11: Heartbeat ACK
        if (op === Constants.OPCODES.HEARTBEAT_ACK) {
            // Logger.debug("Heartbeat Acknowledged.");
        }

        // Op 7: Reconnect (Server Request)
        if (op === Constants.OPCODES.RECONNECT) {
            Logger.warn("Gateway requested reconnect.");
            this.ws?.close();
        }

        // Op 9: Invalid Session
        if (op === Constants.OPCODES.INVALID_SESSION) {
            Logger.warn("Invalid Session. Re-identifying...");
            this.sessionId = null;
            this.lastSequence = null;
            // Wait 1-5s then identify
            setTimeout(() => this.identify(), 2000);
        }

        // Dispatch
        if (op === Constants.OPCODES.DISPATCH) {
            this.emit("dispatch", { t, d });

            if (t === "READY") {
                this.sessionId = d.session_id;
                this.reconnecting = false;
                Logger.success(`Session Ready: ${this.sessionId} | User: ${d.user.username}`);

                // Auto-sync slash commands? 
                // Best practice is to wait for user, but for "Seven" simplicity, let's sync.
                // But we need client access. Gateway doesn't have reference to client easily unless bound.
                // We emit "ready" event, handled by InternalListeners?
            }

            if (t === "RESUMED") {
                this.reconnecting = false;
                Logger.success("Session Resumed successfully!");
            }
        }
    }

    private identify(): void {
        Logger.info("Identifying new session...");
        this.send({
            op: Constants.OPCODES.IDENTIFY,
            d: {
                token: this.token,
                intents: (this as any).intents || Constants.DEFAULT_INTENTS, // Will update Client to pass intents
                properties: {
                    $os: process.platform,
                    $browser: Constants.LIBRARY_NAME,
                    $device: Constants.LIBRARY_NAME
                }
            }
        });
    }

    private resume(): void {
        Logger.info(`Resuming session ${this.sessionId}...`);
        this.send({
            op: Constants.OPCODES.RESUME,
            d: {
                token: this.token,
                session_id: this.sessionId,
                seq: this.lastSequence
            }
        });
    }

    private startHeartbeat(interval: number): void {
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

        // Random jitter
        const jitter = Math.floor(Math.random() * interval);
        setTimeout(() => {
            this.send({ op: Constants.OPCODES.HEARTBEAT, d: this.lastSequence });

            this.heartbeatInterval = setInterval(() => {
                this.send({ op: Constants.OPCODES.HEARTBEAT, d: this.lastSequence });
            }, interval);
        }, jitter);
    }

    public setPresence(status: string, activityName: string, activityType: number = 0): void {
        this.send({
            op: 3,
            d: {
                since: null,
                activities: [{
                    name: activityName,
                    type: activityType
                }],
                status: status, // online, dnd, idle, invisible
                afk: false
            }
        });
    }

    private send(payload: any): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(payload));
        }
    }
}

