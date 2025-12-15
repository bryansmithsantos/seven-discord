import { inflateSync } from "node:zlib"; // Uses built-in Node Compat Zlib
import { Logger } from "../util/Logger";

export class CompressionHandler {
    public static decompress(data: ArrayBuffer | Buffer): any {
        try {
            // Ensure input is a Buffer for zlib
            let buffer: Buffer;
            if (Buffer.isBuffer(data)) {
                buffer = data;
            } else {
                buffer = Buffer.from(data as ArrayBuffer);
            }

            const decompressed = inflateSync(buffer);
            return JSON.parse(decompressed.toString("utf-8"));
        } catch (e: any) {
            Logger.error("Failed to decompress packet", e);
            return null;
        }
    }
}
