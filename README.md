# 💎 Seven-Discord
> **The Simply Powerful Discord Framework for Bun.**

[![npm version](https://badge.fury.io/js/seven-discord.svg)](https://badge.fury.io/js/seven-discord)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Stop writing boilerplate.** Seven-Discord deals with the complex stuff so you can focus on building your bot's logic. Native Speed, Low-Code Macros, and Zero Headaches.

---

## ⚡ Quick Start (In 30 Seconds)

### 1. Install
Open your terminal and run:
```bash
bun add seven-discord
```

### 2. The Code (`index.ts`)
Copy and paste this into your main file. Look how clean the new **Intents** system is!

```typescript
import { SevenClient } from "seven-discord";

const client = new SevenClient({
    token: "YOUR_BOT_TOKEN", 
    // New "Seven" Style Intents! 🛡️
    intents: ["SevenGuild", "SevenMessages", "SevenMessageContent"] 
});

// 1. Startup Message
client.setReady("s.log[✅ Bot is Online as s.userTag!]");

// 2. Simple Ping Command
client.cmd({
    name: "ping",
    code: "Pong! 🏓 Latency: s.pingms"
});

// 3. Easy UI (Interactive Buttons)
client.cmd({
    name: "menu",
    code: `
    $s.send[Click the button below!]
    $s.button[myBtn;Click Me;Primary]
    `
});

// Handle the button click
client.on({
    name: "interactionCreate",
    code: "$s.if[$s.params.customId == 'myBtn'; $s.reply[You clicked it!];]"
});

client.start();
```

### 3. Run It
```bash
bun run index.ts
```

---

## 🌟 Why Seven-Discord?

### 🧩 Macros = Magic
Instead of writing 50 lines of JavaScript for a simple embed, just write:
```
s.embed[title:Hello World;description:This is easy!;color:#00ff00]
```
It's like HTML for Discord Bots.

### 🛡️ Smart "Seven" Intents
We made permissions easy to read. No more guessing numbers.
*   `SevenGuild` - Basic guild stuff.
*   `SevenMessages` - See messages.
*   `SevenMessageContent` - Read actual text.
*   `SevenAll` - YOLO (Everything).

### 🚀 Speed
Built on **Bun**, so it starts instantly and runs faster than Node.js alternatives.

---

## 📚 Documentation 2.0
We completely redesigned our docs. They are now built-in!
*   Open `docs/index.html` in your browser.
*   Beautiful "Dark Mode" UI.
*   Traffic Light Code Blocks 🔴🟡🟢.
*   Search Bar & Portuguese Support 🇧🇷.

---

## 📦 What's New in v2.5.25?
*   **Key-Value Arguments**: Now support `s.embed[title:Hello; color:Red]` syntax!
*   **New Macros**: `s.setStatus`, `s.work`, `s.rob` and more economy features.
*   **Performance**: Optimized variable parsing for lower memory usage.
*   **Docs 2.0**: Completely new dark-mode documentation site.

---

## 🔮 Roadmap to v2.6.0 (The Future)
We are building the next generation of Seven-Discord.
*   [ ] **Voice Support**: `s.join`, `s.play` (Simple Music Bots).
*   [ ] **Advanced Slash**: Subcommands and Autocomplete support.
*   [ ] **SevenDB**: Native, file-based database (faster than JSON).
*   [ ] **Plugin System**: Load external macros easily.

---

## 📄 License
MIT © Seven
