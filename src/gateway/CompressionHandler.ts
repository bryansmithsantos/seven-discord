import { inflateSync } from "bun:zlib"; // Uses built-in Bun Zlib
import { Logger } from "../util/Logger";

export class CompressionHandler {
    public static decompress(data: ArrayBuffer | Buffer): any {
        try {
            // Check if it's zlib compressed (usually starts with 0x78)
            // Or if Discord sends direct zlib stream.
            // For simple gateway zlib-stream support, we assume buffer input.

            const buffer = Buffer.from(data);
            const decompressed = inflateSync(buffer);
            return JSON.parse(decompressed.toString("utf-8"));
        } catch (e: any) {
            Logger.error("Failed to decompress packet", e);
            return null;
        }
    }
}
