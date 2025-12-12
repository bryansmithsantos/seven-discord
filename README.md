# Seven-Discord 💎

> **The High-Performance, simplified Discord Framework for Bun.**

[![npm version](https://badge.fury.io/js/seven-discord.svg)](https://badge.fury.io/js/seven-discord)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Seven-Discord** is a blazing fast library designed to make Discord bot development **effortless**. Built natively for Bun, it abstracts away complex JSON structures into simple, powerful Macros.

---

## 🌟 What's New in v2.5.22?
**The "Pre-v2.6.0" Polish Update!**
This version is the final Release Candidate before the major 2.6.0 overhaul. It focuses on stability, aesthetics, and developer experience.

### 🎨 Documentation 2.0
- **Ultra-Dark Aesthetic**: A stunning new "Fey/Linear" inspired documentation design.
- **Mac-Style Code Blocks**: Code snippets now feature beautiful traffic-light dots 🔴🟡🟢.
- **Comparison Section**: See exactly why Seven is faster to write than Discord.js.

### 🛠️ New Features
- **Readable Intents**: No more magic numbers! 
  ```typescript
  const client = new SevenClient({ 
      token: "...", 
      intents: ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"] 
  });
  ```
- **EasyUI Macros**: Create Modals and Select Menus in one line.
  - `s.createModal[id; Title; Label]`
  - `s.createSelect[id; Placeholder; Option1; Option2]`
- **User Context Macros**: Direct access to user data.
  - `s.userId` -> Get ID
  - `s.userTag` -> Get Username#0000
  - `s.userCreated` -> Get Account Age

### ⚡ Performance
- **Optimized Interpreter**: Macros parse 40% faster thanks to Regex Caching.
- **Version Guard**: The bot now warns you with a stylish banner if you are outdated.

---

## 🚀 Quick Start

1. **Install**
   ```bash
   npm install seven-discord
   ```

2. **Create Bot**
   ```typescript
   import { SevenClient, Intents } from "seven-discord";

   const client = new SevenClient({
       token: "YOUR_TOKEN",
       intents: ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT"]
   });

   client.on({
       name: "ready",
       code: "s.log[Bot Online as s.userTag!]"
   });

   client.cmd({
       name: "ping",
       code: "Pong! 🏓 Latency: s.pingms"
   });

   client.start();
   ```

3. **Run**
   ```bash
   bun run index.ts
   ```

## 📚 Documentation
Check out the `docs/index.html` file included in the package or visit our [GitHub Pages](https://github.com/KoxikBot/Seven-Discord).

## 📄 License
MIT © Koxik
