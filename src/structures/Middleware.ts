/**
 * Middleware System
 * The core differentiator of Seven-Discord.
 * Segregates 'Conditions' from 'Logic'.
 */

import { SevenClient } from "../core/SevenClient";

// A middleware returns TRUE if passed, or FALSE/String (Reason) if failed.
export type MiddlewareResult = boolean | string;

export type MiddlewareFunction = (
    client: SevenClient,
    payload: any // Typed as any for now, will be Context later
) => Promise<MiddlewareResult> | MiddlewareResult;

export class Middleware {
    /**
     * Create a generic middleware.
     */
    static create(fn: MiddlewareFunction): MiddlewareFunction {
        return fn;
    }

    /**
     * Pre-made: Check for specific User ID.
     */
    static onlyUser(userId: string, failMessage: string = "User not allowed"): MiddlewareFunction {
        return (_, ctx) => {
            // Assuming ctx has user.id - This is a "Blind" middleware for now until Context is defined
            return ctx?.author?.id === userId ? true : failMessage;
        };
    }

    /**
     * Pre-made: Cooldown (Simple Memory Store)
     */
    static cooldown(ms: number): MiddlewareFunction {
        const cooldowns = new Map<string, number>();
        return (_, ctx) => {
            const id = ctx?.author?.id;
            if (!id) return true;

            const now = Date.now();
            const last = cooldowns.get(id) || 0;

            if (now - last < ms) {
                return `Wait ${((last + ms - now) / 1000).toFixed(1)}s`;
            }

            cooldowns.set(id, now);
            return true;
        };
    }
}
