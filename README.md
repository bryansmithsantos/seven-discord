# Seven-Discord 🚀

<div align="center">
  <img src="docs/logo.jpeg" alt="Logo" width="200" />
  <h1>v2.4.1 - The Expansion</h1>
  <p>The simplest, zero-dependency Discord library for Bun. Now with <b>Interactive UI</b>, <b>Slash Commands</b> & <b>Economy</b>.</p>
  <p>
    <a href="https://discord.gg/qpRjsjrXcx">
      <img src="https://img.shields.io/discord/1393341011396268133?color=5865F2&logo=discord&logoColor=white" alt="Discord Server" />
    </a>
    <img src="https://img.shields.io/badge/Bun-v1.0+-black?logo=bun" alt="Bun Version" />
    <img src="https://img.shields.io/npm/v/seven-discord?color=red" alt="NPM Version" />
  </p>
</div>

---

## 📚 Official Documentation
👉 [**Read the Docs (Wiki)**](https://bryansmithsantos.github.io/seven-discord/index.html)

---

## 🔥 Why Seven?

Most libraries (Discord.js, Eris) force you to write thousands of lines of JavaScript/TypeScript boilerplate.  
**Seven-Discord** flips the script. You write logic in **Macros**, configuring your bot like a plugin system.

| Capability | Discord.js | Seven-Discord |
| :--- | :--- | :--- |
| **Send Message** | `message.channel.send("Hi")` | `s.reply[Hi]` |
| **Embeds** | `new EmbedBuilder().setTitle(...)` | `s.embed[ s.title[...] ]` |
| **Buttons** | `new ButtonBuilder().setLabel(...)` | `s.button[Click Me; primary; id]` |
| **Logic** | `if (x === y) { ... }` | `s.eq[x; y; True; False]` |
| **Dependencies** | **Heavy (Node_modules hell)** | **Ultralight (0 Deps)** |

## 📦 Installation & CLI (Recommended)

The best way to start is using our **CLI** via Bun. It creates a project with `SecureToken` pre-configured.

### 1. Create a Project
Open your terminal (outside your project folder) and run:

```bash
bunx seven-discord --init --name my-bot
```
*(Use `--slash` for a specific template)*

### 2. Enter and Run
```bash
cd my-bot
bun install
bun run dev
```

The CLI automatically sets up:
- `package.json`
- `tsconfig.json` (Optimized for Bun)
- `.env` template
- `index.ts` with `SecureToken.get()` (prompts you securely if token is missing!)

### Manual Install
If you already have a project:
```bash
bun add seven-discord
```

## 🔐 SecureToken System

In v2.2, we introduced `s.envtoken` (alias for `SecureToken`).
- It automatically checks the environment variable you pass (e.g., `DISCORD_TOKEN`).
- If missing, **it prompts you securely** and saves to `seven_token.enc`.

```typescript
import { SevenClient, s } from "seven-discord";

const bot = new SevenClient({
    token: await s.envtoken("DISCORD_TOKEN"),
    prefix: "!"
});
```

## ⚡ Quick Start

```typescript
import { SevenClient, s } from "seven-discord";

const bot = new SevenClient({
    token: await s.envtoken("DISCORD_TOKEN"), 
    prefix: "!"
});

// Simple Ping
bot.cmd({
    name: "ping",
    code: "s.reply[Pong! 🏓 | **RAM:** s.uptime]"
});

// Interactive UI Panel
bot.cmd({
    name: "panel",
    code: `
    s.reply[
        s.embed[
            s.title[Control Panel v3.0]
            s.desc[Welcome to the future of Seven-Discord.]
            s.color[#5865F2]
            s.footer[Powered by Seven-AI]
        ]
        s.row[
            s.button[Click Me; primary; btn_click; 🚀]
            s.button[Danger Zone; danger; btn_danger; 💀]
            s.button[Link; link; https://google.com]
        ]
    ]
    `
});

// Handle Button Interaction
bot.cmd({
    name: "interact_logic",
    code: `
    s.onInteraction[btn_click; s.reply[You clicked the rocket! 🚀]]
    s.onInteraction[btn_danger; s.reply[⚠️ RUN AWAY!]]
    `
});

bot.start();
```

## 📚 Features

- **Core**: `s.reply`, `s.log`, `s.setVar`, `s.getVar`
- **Logic**: `s.eq`, `s.if` (coming soon)
- **Moderation**: `s.ban`, `s.kick`, `s.mute`, `s.warn`, `s.lock`, `s.purge`
- **Economy**: `s.cash`, `s.addCash`, `s.pay`, `s.bank`, `s.deposit`, `s.work`
- **UI**: `s.embed`, `s.button`, `s.selectMenu`, `s.row`, `s.modal` (beta)
- **System**: `s.ping`, `s.uptime`, `s.botInfo`, `s.eval`
- **Secure**: Built-in Token Encryption & `.env` support.

## 🤝 Contributing

This project is open-source. Feel free to submit PRs for new Macros!
