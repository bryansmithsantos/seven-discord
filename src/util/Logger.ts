import { inspect } from "util";

// Bun supports TrueColor (RGB)
const color = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",

    // Foreground
    white: "\x1b[37m",
    gray: "\x1b[90m",
    blue: "\x1b[34m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    magenta: "\x1b[35m",

    // Backgrounds (Badges)
    bgCyan: "\x1b[46m",
    bgGreen: "\x1b[42m",
    bgRed: "\x1b[41m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
};

export enum LogLevel {
    INFO = "INFO",
    SUCCESS = "SUCCESS",
    WARN = "WARN",
    ERROR = "ERROR",
    DEBUG = "DEBUG",
    CMD = "COMMAND"
}

export class Logger {

    private static getTime(): string {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour12: false });
    }

    private static print(badge: string, badgeColor: string, message: string, messageColor: string = color.white) {
        const time = `${color.gray}[${this.getTime()}]${color.reset}`;
        console.log(`${time} ${badgeColor}${color.bold} ${badge} ${color.reset} ${messageColor}${message}${color.reset}`);
    }

    static info(message: string) {
        this.print(" INFO ", color.bgBlue, message, color.blue);
    }

    static success(message: string) {
        this.print("  OK  ", color.bgGreen, message, color.green);
    }

    static warn(message: string) {
        this.print(" WARN ", color.bgYellow, message, color.yellow);
    }

    static error(message: string, error?: any) {
        this.print(" ERROR ", color.bgRed, message, color.red);
        if (error) {
            console.error(error);
        }
    }

    static debug(message: string) {
        // Only if debug enabled? For now always.
        this.print(" DEBUG ", color.bgMagenta, message, color.gray);
    }

    static table(title: string) {
        console.log(`\n${color.gray}◈ ━━━━━━━━━━━━━━━━━━━━ ${color.bold}${color.white}${title}${color.reset}${color.gray} ━━━━━━━━━━━━━━━━━━━━ ◈${color.reset}`);
    }

    // Special formatted log for loading items
    static load(type: "command" | "event" | "macro", name: string, status: "success" | "fail" = "success") {
        const time = `${color.gray}[${this.getTime()}]${color.reset}`;
        const symbol = status === "success" ? `${color.green}✔${color.reset}` : `${color.red}✖${color.reset}`;
        const typeFmt = type.padEnd(8);

        console.log(`${time} ${symbol} ${color.cyan}${typeFmt}${color.reset} :: ${color.bold}${name}${color.reset}`);
    }

    static banner() {
        console.clear();
        const banner = `
    ${color.cyan}███████╗███████╗██╗   ██╗███████╗███╗   ██╗${color.reset}
    ${color.cyan}██╔════╝██╔════╝██║   ██║██╔════╝████╗  ██║${color.reset}
    ${color.blue}███████╗█████╗  ██║   ██║█████╗  ██╔██╗ ██║${color.reset}
    ${color.blue}╚════██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║${color.reset}
    ${color.magenta}███████║███████╗ ╚████╔╝ ███████╗██║ ╚████║${color.reset}
    ${color.magenta}╚══════╝╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝${color.reset}
        `;
        console.log(banner);
    }
}
