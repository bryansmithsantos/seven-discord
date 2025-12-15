import { Logger } from "./Logger";

export class AntiCrash {
    public static init() {
        process.on("uncaughtException", (err) => {
            Logger.error("[AntiCrash] Uncaught Exception:", err);
        });

        process.on("unhandledRejection", (reason, promise) => {
            Logger.error("[AntiCrash] Unhandled Rejection:", reason);
        });

        Logger.info("[AntiCrash] Protected against main process crashes.");
    }
}
