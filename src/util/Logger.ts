import { inspect } from "util";

// Bun supports TrueColor (RGB)
const color = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",

    // Foreground
    white: "\x1b[37m",
    gray: "\x1b[90m",

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
        // Badge format: [ TIME ] [ BADGE ] Message
        // We use spaces padded to make badges align if needed, but for now simple block

        console.log(`${time} ${badgeColor}${color.bold} ${badge} ${color.reset} ${messageColor}${message}${color.reset}`);
    }

    static info(message: string) {
        this.print("INFO", color.bgCyan, message);
    }

    static success(message: string) {
        this.print("SUCCESS", color.bgGreen, message);
    }

    static warn(message: string) {
        this.print("WARN", color.bgYellow, message);
    }

    static error(message: string, error?: any) {
        this.print("ERROR", color.bgRed, message);
        if (error) {
            console.error(error);
        }
    }

    static debug(message: string) {
        this.print("DEBUG", color.bgMagenta, message, color.gray);
    }

    static table(title: string) {
        console.log(`\n${color.gray}-------------------------------- ${color.bold}${color.white}${title}${color.reset}${color.gray} --------------------------------${color.reset}`);
    }

    // Special formatted log for loading items (as seen in image)
    static load(type: "command" | "event" | "macro", name: string, status: "success" | "fail" = "success") {
        const badge = status === "success" ? color.bgGreen : color.bgRed;
        const icon = status === "success" ? "SUCCESS" : "FAIL";
        const time = `${color.gray}[${this.getTime()}]${color.reset}`;

        console.log(`${time} ${badge}${color.bold} ${icon} ${color.reset} Loaded ${type} ${color.gray}→${color.reset} ${color.bold}${name}${color.reset}`);
    }
}
