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

    constructor(token: string) {
        super();
        this.token = token;
    }

    public connect(): void {
        Logger.info(`Connecting to ${Constants.GATEWAY_URL}...`);

        // Bun native WebSocket
        this.ws = new WebSocket(Constants.GATEWAY_URL);

        this.ws.onopen = () => {
            Logger.success("WebSocket connection opened.");
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
            Logger.warn(`Connection closed: ${event.code} - ${event.reason}`);
            this.reconnect();
        };
    }

    private handlePayload(payload: any): void {
        const { op, t, d, s } = payload;

        if (s) this.lastSequence = s;

        // Op 10: Hello
        if (op === Constants.OPCODES.HELLO) {
            this.startHeartbeat(d.heartbeat_interval);
            this.identify();
        }

        // Op 11: Heartbeat ACK
        if (op === Constants.OPCODES.HEARTBEAT_ACK) {
            Logger.debug("Heartbeat Acknowledged.");
        }

        // Dispatch
        if (op === Constants.OPCODES.DISPATCH) {
            this.emit("dispatch", { t, d });
            if (t === "READY") {
                this.sessionId = d.session_id;
                Logger.success(`Session Ready: ${this.sessionId}`);
            }
        }
    }

    private identify(): void {
        Logger.info("Identifying...");
        this.send({
            op: Constants.OPCODES.IDENTIFY,
            d: {
                token: this.token,
                intents: Constants.DEFAULT_INTENTS,
                properties: {
                    $os: process.platform,
                    $browser: Constants.LIBRARY_NAME,
                    $device: Constants.LIBRARY_NAME
                }
            }
        });
    }

    private startHeartbeat(interval: number): void {
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

        Logger.debug(`Starting heartbeat every ${interval}ms`);
        this.heartbeatInterval = setInterval(() => {
            this.send({ op: Constants.OPCODES.HEARTBEAT, d: this.lastSequence });
        }, interval);
    }

    private send(payload: any): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(payload));
        }
    }

    private reconnect(): void {
        Logger.info("Reconnecting in 5s...");
        setTimeout(() => this.connect(), 5000);
    }
}
