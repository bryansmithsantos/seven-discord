/**
 * Zero-Copy Buffer Utilities
 * Optimized for Bun's usage of typed arrays.
 */
export class ZeroCopy {
    public static create(size: number): Uint8Array {
        return new Uint8Array(size); // Bun optimizes this allocation
    }

    public static toString(buffer: Uint8Array): string {
        return new TextDecoder().decode(buffer);
    }

    public static fromString(str: string): Uint8Array {
        return new TextEncoder().encode(str);
    }
}
