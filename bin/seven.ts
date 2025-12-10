#!/usr/bin/env bun
import { parseArgs } from "util";
import fs from "fs";
import path from "path";

const { values } = parseArgs({
    args: Bun.argv,
    options: {
        init: { type: 'boolean' },
        name: { type: 'string', default: 'my-bot' },
        slash: { type: 'boolean', default: false },
        token: { type: 'string' }
    },
    strict: true,
    allowPositionals: true
});

if (values.init) {
    console.log(`🚀 Initializing Seven-Discord project: ${values.name}...`);

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
    fs.writeFileSync(path.join(values.name, "package.json"), JSON.stringify(packageJson, null, 2));

    // Create .env
    const envContent = `DISCORD_TOKEN=${values.token || "YOUR_TOKEN_HERE"}`;
    fs.writeFileSync(path.join(values.name, ".env"), envContent);

    // Create .gitignore
    const gitignore = `node_modules/\n.env\n.bun/`;
    fs.writeFileSync(path.join(values.name, ".gitignore"), gitignore);

    // Create index.ts
    const indexContent = `import { SevenClient, s } from "seven-discord";

const bot = new SevenClient({
    token: await s.envtoken("DISCORD_TOKEN"), 
    prefix: "!"
});

bot.cmd({
    name: "ping",
    code: "s.reply[Pong! 🏓]"
});

${values.slash ? `// Slash Command Example
// bot.cmdSlash({
//     name: "hello",
//     description: "Says hello via Slash",
//     code: "s.reply[Hello Interaction!]"
// });` : ""}

bot.start();
`;
    fs.writeFileSync(path.join(values.name, "index.ts"), indexContent);

    console.log("✅ Project created successfully!");
    console.log(`\ncd ${values.name}\nbun install\nbun run dev`);
} else {
    console.log("Usage: seven --init --name <project_name> [--slash]");
}
