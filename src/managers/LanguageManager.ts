import { SevenClient } from "../core/SevenClient";
import fs from "fs";
import path from "path";

export class LanguageManager {
    public languages: Map<string, any> = new Map();
    public defaultLang: string = "en";

    constructor() { }

    public load(dir: string) {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);

        for (const file of files) {
            if (file.endsWith(".json")) {
                const langName = file.replace(".json", "");
                try {
                    const content = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
                    this.languages.set(langName, content);
                } catch (e) {
                    console.error(`[i18n] Failed to load ${file}`);
                }
            }
        }
    }

    public get(key: string, lang: string = this.defaultLang, args: Record<string, string> = {}): string {
        const langData = this.languages.get(lang) || this.languages.get(this.defaultLang);
        if (!langData) return key;

        let str = langData[key] || key;

        // Replace variables {name}
        for (const [k, v] of Object.entries(args)) {
            str = str.replace(new RegExp(`{${k}}`, "g"), v);
        }

        return str;
    }
}
