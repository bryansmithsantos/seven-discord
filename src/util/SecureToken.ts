
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = crypto.scryptSync('seven-discord-secure-key', 'salt', 32);
const IV_LENGTH = 16;
const TOKEN_FILE = path.join(process.cwd(), "seven_token.enc");

export class SecureToken {
    /**
     * Retrieves the token from memory, file, or prompts the user.
     * Encrypts and saves if newly entered.
     */
    public static async get(): Promise<string> {
        // 1. Check process env (runtime override)
        if (process.env.DISCORD_TOKEN) return process.env.DISCORD_TOKEN;

        // 2. Check direct .env (legacy/standard)
        if (fs.existsSync(".env")) {
            const content = fs.readFileSync(".env", "utf-8");
            const match = content.match(/DISCORD_TOKEN=(.*)/);
            if (match && match[1]) {
                const envToken = match[1].trim();
                if (envToken && envToken.length > 5) return envToken;
            }
        }

        // 3. Check encrypted file
        if (fs.existsSync(TOKEN_FILE)) {
            try {
                const encrypted = fs.readFileSync(TOKEN_FILE, "utf-8");
                return this.decrypt(encrypted);
            } catch (e) {
                console.error("Failed to decrypt token file. It may be corrupted.");
            }
        }

        // 4. Prompt User
        console.log("\n🔑 Token not found!");
        process.stdout.write("Paste your Bot Token or path to file: ");

        const answer = await this.prompt();
        let token = answer.trim();

        // Check if path
        if (fs.existsSync(token)) {
            token = fs.readFileSync(token, "utf-8").trim();
        }

        // Validate basic token structure (rough check)
        if (token.length < 50) {
            // Warn but proceed? Or throw?
            // throw new Error("Invalid token format.");
        }

        // 5. Encrypt and Save
        try {
            const encrypted = this.encrypt(token);
            fs.writeFileSync(TOKEN_FILE, encrypted);
            console.log(`🔒 Token encrypted and saved to ${TOKEN_FILE}`);

            // Update .gitignore to ensure this file isn't pushed
            this.ensureGitIgnore();
        } catch (err: any) {
            console.error(`Failed to save encrypted token: ${err.message}`);
        }

        return token;
    }

    private static encrypt(text: string): string {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    private static decrypt(text: string): string {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift()!, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    private static async prompt(): Promise<string> {
        return new Promise(resolve => {
            const readline = require("readline").createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readline.question("", (ans: string) => {
                readline.close();
                resolve(ans);
            });
        });
    }

    private static ensureGitIgnore() {
        const ignorePath = path.join(process.cwd(), ".gitignore");
        const entry = "seven_token.enc";

        if (fs.existsSync(ignorePath)) {
            const content = fs.readFileSync(ignorePath, "utf-8");
            if (!content.includes(entry)) {
                fs.appendFileSync(ignorePath, `\n${entry}`);
            }
        } else {
            fs.writeFileSync(ignorePath, `${entry}\nnode_modules\n.env`);
        }
    }
}
