export class Heap {
    public static snapshot() {
        const usage = process.memoryUsage();
        return {
            rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
            heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
            external: `${Math.round(usage.external / 1024 / 1024)}MB`,
        };
    }

    public static log() {
        console.table(this.snapshot());
    }
}
