/**
 * HTTP/3 Adapter
 * Bun's native fetch already supports modern protocols.
 * This class serves as a configuration point for future HTTP/3 specific optimizations.
 */
export class HTTP3Adapter {
    static get options() {
        return {
            keepalive: true,
            priority: "high"
        };
    }
}
