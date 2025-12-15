export class Spinner {
    private frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    private interval: any;
    private frameIndex = 0;
    private text: string;

    constructor(text: string) {
        this.text = text;
    }

    start() {
        process.stdout.write("\x1B[?25l"); // Hide cursor
        this.interval = setInterval(() => {
            const frame = this.frames[this.frameIndex];
            this.frameIndex = (this.frameIndex + 1) % this.frames.length;
            process.stdout.write(`\r\x1b[36m${frame}\x1b[0m ${this.text}`);
        }, 80);
    }

    stop(success: boolean = true, newText?: string) {
        clearInterval(this.interval);
        process.stdout.write("\r\x1B[K"); // Clear line
        process.stdout.write("\x1B[?25h"); // Show cursor

        const symbol = success ? "✅" : "❌";
        const msg = newText || this.text;
        console.log(`${symbol} ${msg}`);
    }
}
