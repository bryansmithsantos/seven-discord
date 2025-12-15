#!/usr/bin/env bun
import { parseArgs } from "util";
import fs from "fs";
import path from "path";
import os from "os";

const { values } = parseArgs({
    args: Bun.argv,
    options: {
        init: { type: 'boolean' },
        name: { type: 'string', default: 'my-bot' },
        slash: { type: 'boolean', default: false },
        token: { type: 'string' },
        doc: { type: 'string' }
    },
    strict: true,
    allowPositionals: true
});

const macros = [
    // Core
    { name: "s.reply", desc: "Reply to message/interaction.", usage: "s.reply[Content]", example: "s.reply[Hello User!]", category: "Core" },
    { name: "s.log", desc: "Log to console.", usage: "s.log[Text]", example: "s.log[Debug: Button Clicked]", category: "Core" },
    { name: "s.setVar", desc: "Set a variable.", usage: "s.setVar[Key; Value]", example: "s.setVar[money; 0]", category: "Core" },
    { name: "s.getVar", desc: "Get a variable.", usage: "s.getVar[Key]", example: "s.getVar[money]", category: "Core" },
    { name: "s.eq", desc: "Check equality.", usage: "s.eq[A; B]", example: "s.eq[s.getVar[money]; 100]", category: "Logic" },
    { name: "s.if", desc: "Condition.", usage: "s.if[Condition; True; False]", example: "s.if[s.eq[1;1]; Yes; No]", category: "Logic" },

    // Math
    { name: "s.math", desc: "Calculate.", usage: "s.math[Expr]", example: "s.math[10 + 5 * 2]", category: "Math" },
    { name: "s.random", desc: "Random number.", usage: "s.random[Min; Max]", example: "s.random[1; 100]", category: "Math" },

    // String
    { name: "s.len", desc: "Text length.", usage: "s.len[Text]", example: "s.len[Hello]", category: "String" },
    { name: "s.upper", desc: "Uppercase.", usage: "s.upper[Text]", example: "s.upper[hello]", category: "String" },
    { name: "s.lower", desc: "Lowercase.", usage: "s.lower[Text]", example: "s.lower[HELLO]", category: "String" },

    // Economy
    { name: "s.addCash", desc: "Add money to user.", usage: "s.addCash[Amount; UserID]", example: "s.addCash[100; s.authorID]", category: "Economy" },
    { name: "s.removeCash", desc: "Remove money.", usage: "s.removeCash[Amount; UserID]", example: "s.removeCash[50; s.authorID]", category: "Economy" },
    { name: "s.setCash", desc: "Set user balance.", usage: "s.setCash[Amount; UserID]", example: "s.setCash[1000; s.authorID]", category: "Economy" },
    { name: "s.cash", desc: "Get balance.", usage: "s.cash[UserID]", example: "s.cash[s.authorID]", category: "Economy" },
    { name: "s.pay", desc: "Transfer money.", usage: "s.pay[Amount; UserID]", example: "s.pay[50; 123456789]", category: "Economy" },
    { name: "s.bank", desc: "Get bank balance.", usage: "s.bank[UserID]", example: "s.bank[s.authorID]", category: "Economy" },
    { name: "s.deposit", desc: "Deposit to bank.", usage: "s.deposit[Amount]", example: "s.deposit[100]", category: "Economy" },
    { name: "s.withdraw", desc: "Withdraw from bank.", usage: "s.withdraw[Amount]", example: "s.withdraw[50]", category: "Economy" },
    { name: "s.setCurrency", desc: "Set currency symbol.", usage: "s.setCurrency[Sym]", example: "s.setCurrency[€]", category: "Economy" },

    // Moderation
    { name: "s.ban", desc: "Ban user.", usage: "s.ban[UserID; Reason]", example: "s.ban[123456789; Spam]", category: "Moderation" },
    { name: "s.kick", desc: "Kick user.", usage: "s.kick[UserID; Reason]", example: "s.kick[123456789; Bad]", category: "Moderation" },
    { name: "s.mute", desc: "Timeout user.", usage: "s.mute[UserID; Duration; Reason]", example: "s.mute[123456789; 60s; Rude]", category: "Moderation" },
    { name: "s.unmute", desc: "Remove timeout.", usage: "s.unmute[UserID; Reason]", example: "s.unmute[123456789; Appeal]", category: "Moderation" },
    { name: "s.purge", desc: "Delete messages.", usage: "s.purge[Amount]", example: "s.purge[10]", category: "Moderation" },
    { name: "s.lock", desc: "Lock channel.", usage: "s.lock", example: "s.lock", category: "Moderation" },
    { name: "s.unlock", desc: "Unlock channel.", usage: "s.unlock", example: "s.unlock", category: "Moderation" },
    { name: "s.slowmode", desc: "Set slowmode.", usage: "s.slowmode[Seconds]", example: "s.slowmode[5]", category: "Moderation" },
    { name: "s.warn", desc: "Warn user.", usage: "s.warn[UserID; Reason]", example: "s.warn[123456789; Caps]", category: "Moderation" },
    { name: "s.unwarn", desc: "Remove warn.", usage: "s.unwarn[UserID; CaseID]", example: "s.unwarn[123456789; 1]", category: "Moderation" },
    { name: "s.warnings", desc: "List warnings.", usage: "s.warnings[UserID]", example: "s.warnings[123456789]", category: "Moderation" },

    // System
    { name: "s.setStatus", desc: "Set bot status.", usage: "s.setStatus[Type; Status; Name]", example: "s.setStatus[playing; online; Seven-Discord]", category: "System" },
    { name: "s.ping", desc: "Get latency.", usage: "s.ping", category: "System", example: "LATENCY: s.ping ms" },
    { name: "s.uptime", desc: "Get uptime.", usage: "s.uptime", category: "System", example: "UPTIME: s.uptime" },
    { name: "s.botInfo", desc: "Get bot stats.", usage: "s.botInfo", category: "System", example: "s.botInfo" },
    { name: "s.serverInfo", desc: "Get guild stats.", usage: "s.serverInfo", category: "System", example: "s.serverInfo" },
    { name: "s.userInfo", desc: "Get user stats.", usage: "s.userInfo[UserID]", category: "System", example: "s.userInfo[s.authorID]" },
    { name: "s.avatar", desc: "Get avatar URL.", usage: "s.avatar[UserID]", category: "System", example: "s.avatar[s.authorID]" },
    { name: "s.shutdown", desc: "Stop bot.", usage: "s.shutdown", category: "System", example: "s.shutdown" },
    { name: "s.eval", desc: "Eval JS.", usage: "s.eval[Code]", category: "System", example: "s.eval[2+2]" },

    // UI
    { name: "s.embed", desc: "Create Embed.", usage: "s.embed[...]", example: "s.embed[s.title[Hi] s.desc[Hello]]", category: "UI" },
    { name: "s.title", desc: "Embed Title.", usage: "s.title[Text]", example: "s.title[Welcome]", category: "UI" },
    { name: "s.desc", desc: "Embed Description.", usage: "s.desc[Text]", example: "s.desc[This is a description]", category: "UI" },
    { name: "s.color", desc: "Embed Color.", usage: "s.color[Hex]", example: "s.color[#FF0000]", category: "UI" },
    { name: "s.image", desc: "Embed Image.", usage: "s.image[URL]", example: "s.image[https://example.com/img.png]", category: "UI" },
    { name: "s.thumb", desc: "Embed Thumbnail.", usage: "s.thumb[URL]", example: "s.thumb[https://example.com/img.png]", category: "UI" },
    { name: "s.footer", desc: "Embed Footer.", usage: "s.footer[Text; Icon]", example: "s.footer[By Seven; URL]", category: "UI" },
    { name: "s.button", desc: "Create Button.", usage: "s.button[Label; Style; ID; Emoji]", example: "s.button[Click Me; primary; btn_click; 🖱️]", category: "UI" },
    { name: "s.row", desc: "Action Row.", usage: "s.row[...]", example: "s.row[s.button[Yes; success; yes] s.button[No; danger; no]]", category: "UI" },
    { name: "s.selectMenu", desc: "Dropdown Menu.", usage: "s.selectMenu[ID; Placeholder; Min; Max; ...options]", example: "s.selectMenu[menu; Select...; 1; 1; s.selectOption[A; a] s.selectOption[B; b]]", category: "UI" },
    { name: "s.selectOption", desc: "Menu Option.", usage: "s.selectOption[Label; Value; Desc; Emoji; Default]", example: "s.selectOption[Option 1; opt1; Description; 1️⃣; false]", category: "UI" },
    { name: "s.onInteraction", desc: "Handle Buttons.", usage: "s.onInteraction[ID] ...", example: "s.onInteraction[btn_click] s.reply[You clicked!]", category: "UI" }
];

const VERSION = require("../package.json").version;

async function checkUpdate() {
    try {
        const res = await fetch("https://registry.npmjs.org/seven-discord/latest");
        const data = await res.json() as any;
        if (data.version !== VERSION) {
            console.log(`\n\x1b[33m[UPDATE AVAILABLE]\x1b[0m v${VERSION} -> v${data.version}`);
            console.log(`Run \x1b[36mbun add seven-discord@latest\x1b[0m to update.\n`);
        }
    } catch (e) { }
}

async function installSnippets(projectDir: string) {
    const vscodeDir = path.join(projectDir, ".vscode");
    if (!fs.existsSync(vscodeDir)) fs.mkdirSync(vscodeDir);

    // Snippets content
    const snippets = {
        "Seven Embed": {
            "prefix": "s.embed",
            "body": ["s.embed[", "\ts.title[${1:Title}]", "\ts.desc[${2:Description}]", "\ts.color[#3b82f6]", "\ts.footer[${3:Footer}]", "]"],
            "description": "Create a Seven-Discord Embed"
        },
        "Seven Button": {
            "prefix": "s.button",
            "body": ["s.button[${1:Label}; ${2:style}; ${3:id}; ${4:emoji}]"],
            "description": "Create a Button"
        },
        "Seven Reply": {
            "prefix": "s.reply",
            "body": ["s.reply[${1:Content}]"],
            "description": "Reply macro"
        },
        "Seven Command": {
            "prefix": "seven-cmd",
            "body": ["export default {", "    name: \"${1:name}\",", "    code: `", "    s.reply[${2:Content}]", "    `", "};"],
            "description": "Create a new Command"
        }
    };

    fs.writeFileSync(path.join(vscodeDir, "seven.code-snippets"), JSON.stringify(snippets, null, 2));
}

/*
 * MAIN LOGIC
 */
if (values.doc) {
    checkUpdate(); // Async check while showing docs
    const search = values.doc.toLowerCase();
    const found = macros.find(m => m.name.toLowerCase() === search || m.name.toLowerCase() === "s." + search);

    if (found) {
        console.log(`\n📘 \x1b[36m${found.name}\x1b[0m \x1b[90m[${found.category}]\x1b[0m`);
        console.log(`   ${found.desc}\n`);
        console.log(`   \x1b[33mUsage:\x1b[0m   ${found.usage}`);
        console.log(`   \x1b[32mExample:\x1b[0m ${found.example}\n`);
    } else {
        const similar = macros.filter(m => m.name.toLowerCase().includes(search));
        if (similar.length > 0) {
            console.log(`\n❌ Macro not found. Did you mean?`);
            similar.forEach(m => console.log(`   - \x1b[36m${m.name}\x1b[0m`));
        } else {
            console.log(`\n❌ Macro not found.`);
        }
    }
} else if (values.init) {
    console.log(`🚀 Initializing Seven-Discord project: ${values.name}...`);
    await checkUpdate();

    if (fs.existsSync(values.name)) {
        console.error("❌ Directory already exists!");
        process.exit(1);
    }

    fs.mkdirSync(values.name);

    // Create package.json
    const packageJson = {
        name: values.name,
        version: "1.0.0",
        main: "index.ts",
        dependencies: {
            "seven-discord": "latest"
        },
        scripts: {
            "start": "bun run index.ts",
            "dev": "bun --watch index.ts"
        }
    };

    let indexContent = "";
    if (process.argv.includes("--template") && process.argv.includes("music")) {
        (packageJson.dependencies as any)["seven-music"] = "latest";
        indexContent = `import { SevenClient, s } from "seven-discord";
import MusicPlugin from "seven-music";

const bot = new SevenClient({ token: await s.envtoken("DISCORD_TOKEN") });
bot.loadPlugins("./plugins"); // Load dynamic plugins
// ... music setup
bot.start();`;
    } else {
        indexContent = `import { SevenClient, s } from "seven-discord";
const bot = new SevenClient({ token: await s.envtoken("DISCORD_TOKEN") });
bot.cmd({ name: "ping", code: "s.reply[Pong! 🏓]" });
bot.start();`;
    }

    fs.writeFileSync(path.join(values.name, "package.json"), JSON.stringify(packageJson, null, 2));

    // Create .env
    const envContent = `DISCORD_TOKEN=${values.token || "YOUR_TOKEN_HERE"}`;
    fs.writeFileSync(path.join(values.name, ".env"), envContent);

    // Create .gitignore
    const gitignore = `node_modules/\n.env\n.bun/`;
    fs.writeFileSync(path.join(values.name, ".gitignore"), gitignore);

    fs.writeFileSync(path.join(values.name, "index.ts"), indexContent);

    // Auto-Install Extensions Prompt (Simulated Logic)
    console.log("✅ Project created successfully!");
    await installSnippets(values.name);

    console.log(`\ncd ${values.name}\nbun install\nbun run dev`);

} else if (process.argv[2] === "create") {
    // Legacy support or alias
    const name = process.argv[3];
    const templateFlag = process.argv.indexOf("--template");
    const template = templateFlag > -1 ? process.argv[templateFlag + 1] : "default";

    if (!name) {
        console.error("❌ Usage: seven create <name> [--template <template>]");
        process.exit(1);
    }

    // Dynamic import Spinner
    let Spinner;
    try {
        const mod = require("../src/util/Spinner");
        Spinner = mod.Spinner;
    } catch (e) {
        // Fallback mock
        Spinner = class {
            constructor(t: string) { console.log(t); }
            start() { }
            stop(s: boolean, t?: string) { if (t) console.log(s ? "✅ " + t : "❌ " + t); }
        }
    }

    const spin = new Spinner(`Creating project \x1b[36m${name}\x1b[0m...`);
    spin.start();

    // Simulate delay for "feel"
    await new Promise(r => setTimeout(r, 800));

    if (fs.existsSync(name)) {
        spin.stop(false, "Directory already exists!");
        process.exit(1);
    }
    fs.mkdirSync(name);

    const packageJson = {
        name: name,
        version: "1.0.0",
        main: "index.ts",
        dependencies: {
            "seven-discord": "latest"
        },
        scripts: {
            "start": "bun run index.ts",
            "dev": "bun --watch index.ts"
        }
    };

    let indexContent = "";
    if (template === "music") {
        (packageJson.dependencies as any)["seven-music"] = "latest";
        indexContent = `import { SevenClient, s } from "seven-discord";
import MusicPlugin from "seven-music";

const bot = new SevenClient({ token: await s.envtoken("DISCORD_TOKEN") });
bot.loadPlugins("./plugins"); // Load dynamic plugins
// ... music setup
bot.start();`;
    } else {
        indexContent = `import { SevenClient, s } from "seven-discord";
const bot = new SevenClient({ token: await s.envtoken("DISCORD_TOKEN") });
bot.cmd({ name: "ping", code: "s.reply[Pong! 🏓]" });
bot.start();`;
    }

    fs.writeFileSync(path.join(name, "package.json"), JSON.stringify(packageJson, null, 2));
    fs.writeFileSync(path.join(name, "index.ts"), indexContent);
    fs.writeFileSync(path.join(name, ".env"), "DISCORD_TOKEN=YOUR_TOKEN");

    const gitignore = `node_modules/\n.env\n.bun/`;
    fs.writeFileSync(path.join(name, ".gitignore"), gitignore);

    await installSnippets(name);

    spin.stop(true, "Project created.");
    console.log(`\ncd ${name}\nbun install\nbun run dev`);

} else if (process.argv[2] === "install") {
    const pkg = process.argv[3];
    if (!pkg) {
        console.error("❌ Please specify a package name.");
        process.exit(1);
    }

    let Spinner;
    try {
        const mod = require("../src/util/Spinner");
        Spinner = mod.Spinner;
    } catch (e) {
        Spinner = class {
            constructor(t: string) { console.log(t); }
            start() { }
            stop(s: boolean, t?: string) { if (t) console.log(s ? "✅ " + t : "❌ " + t); }
        }
    }

    const spin = new Spinner(`Installing \x1b[36m${pkg}\x1b[0m...`);
    spin.start();

    const { RegistryManager } = require("../src/managers/RegistryManager");
    const success = await RegistryManager.install(pkg);

    if (success) {
        spin.stop(true, `Installed ${pkg}`);
    } else {
        spin.stop(false, "Installation failed");
    }

} else if (process.argv[2] === "search") {
    const query = process.argv[3] || "";
    if (!query) {
        console.error("❌ Please specify a search query.");
        process.exit(1);
    }
    const { RegistryManager } = require("../src/managers/RegistryManager");
    const results = await RegistryManager.search(query);

    console.log(`\n🔎 Search results for '\x1b[36m${query}\x1b[0m':\n`);
    if (results.length === 0) {
        console.log("   No results found.");
    } else {
        results.forEach((pkg: any) => {
            console.log(`   \x1b[35m${pkg.name}\x1b[0m v${pkg.version}`);
            console.log(`     ${pkg.description}`);
            console.log(`     \x1b[90m${pkg.url}\x1b[0m\n`);
        });
    }

} else if (process.argv.includes("doctor")) {
    console.log(`\n\x1b[36mSeven-Discord Doctor 🩺\x1b[0m\n`);

    const bunVer = process.version;
    console.log(`[✅] Runtime: Bun ${bunVer}`);

    if (fs.existsSync("package.json")) {
        console.log(`[✅] Project: package.json found`);
        try {
            const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
            if (pkg.dependencies && pkg.dependencies["seven-discord"]) {
                console.log(`[✅] Dependency: seven-discord v${pkg.dependencies["seven-discord"]}`);
            } else {
                console.log(`[❌] Dependency: seven-discord NOT installed (Run: bun add seven-discord)`);
            }
        } catch (e) {
            console.log(`[❌] Project: package.json is invalid`);
        }
    } else {
        console.log(`[⚠️] Project: No package.json found (Are you in the root?)`);
    }

    if (fs.existsSync(".env")) {
        const env = fs.readFileSync(".env", "utf-8");
        if (env.includes("DISCORD_TOKEN=")) {
            console.log(`[✅] Env: .env found with token`);
        } else {
            console.log(`[❌] Env: .env found but MISSING DISCORD_TOKEN`);
        }
    } else {
        console.log(`[⚠️] Env: No .env file found`);
    }

    // Check Memory
    const totalMem = Math.round(os.totalmem() / 1024 / 1024 / 1024);
    const freeMem = Math.round(os.freemem() / 1024 / 1024 / 1024);
    console.log(`[ℹ️] System: ${totalMem}GB Total / ${freeMem}GB Free RAM`);

    // Check FFmpeg
    try {
        const ffmpegVer = require("child_process").execSync("ffmpeg -version", { stdio: "pipe" }).toString().split("\n")[0];
        console.log(`[✅] FFmpeg: Installed (${ffmpegVer.split("version")[1].trim().split(" ")[0]})`);
    } catch (e) {
        console.log(`[⚠️] FFmpeg: Not found (Voice functionality might be limited)`);
    }

    // Check FFmpeg
    try {
        const ffmpegVer = require("child_process").execSync("ffmpeg -version", { stdio: "pipe" }).toString().split("\n")[0];
        console.log(`[✅] FFmpeg: Installed (${ffmpegVer.split("version")[1].trim().split(" ")[0]})`);
    } catch (e) {
        console.log(`[⚠️] FFmpeg: Not found (Voice functionality might be limited)`);
    }

    console.log(`\nDiagnostics complete.`);

} else if (process.argv[2] === "test") {
    console.log(`\n\x1b[36m🧪 Seven-Discord Test Runner\x1b[0m\n`);

    // We need a client instance to test macros
    // This is a bit hacky for a CLI tool, usually we'd run a test file
    // For now, we'll run a few built-in sanity checks

    // Mock Client logic would go here.
    // Since we can't easily instantiate a full client without token in CLI,
    // we will notify the user this is for project-level tests in the future.

    console.log("To run project tests, use: \x1b[33mbun test\x1b[0m");
    console.log("(Native Seven Test Runner integration coming in v2.7)");

} else {
    // Default Help
    console.log(`
\x1b[36mSeven-Discord CLI\x1b[0m v${VERSION}

Usage:
  seven create <name>            Create new project
  seven install <pkg>            Install a plugin
  seven search <query>           Search plugins
  seven doctor                   Check health
  seven --doc <macro>            Documentation

Options:
  --template <name>              Use specific template (create)
`);
    checkUpdate();
}
