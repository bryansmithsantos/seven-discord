/**
 * Middleware Function Type
 * Allows intercepting command execution.
 */
export type MiddlewareFunction = (ctx: any, next: () => Promise<void>) => Promise<void>;

/**
 * Middleware Manager
 * Handles the registration and execution of middleware.
 */
export class MiddlewareManager {
    private middlewares: MiddlewareFunction[] = [];

    /**
     * Use a middleware function.
     * @param fn The middleware function to use.
     */
    use(fn: MiddlewareFunction) {
        this.middlewares.push(fn);
    }

    /**
     * Execute all middlewares.
     * @param ctx The context to pass to middlewares.
     * @param final The final function to execute after all middlewares.
     */
    async execute(ctx: any, final: () => Promise<void>) {
        const executeMiddleware = async (index: number) => {
            if (index < this.middlewares.length) {
                const fn = this.middlewares[index];
                await fn(ctx, () => executeMiddleware(index + 1));
            } else {
                await final();
            }
        };

        await executeMiddleware(0);
    }
}
