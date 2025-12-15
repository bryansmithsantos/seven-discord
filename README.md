# 💎 Seven-Discord
> **The Simply Powerful Discord Framework for Bun.**

[![npm version](https://badge.fury.io/js/seven-discord.svg)](https://badge.fury.io/js/seven-discord)
[![Downloads](https://img.shields.io/npm/dw/seven-discord)](https://www.npmjs.com/package/seven-discord)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Seven-Discord** is an ultra-fast, opinionated framework for building Discord bots using the **Bun** runtime. It abstracts complex WebSocket interactions, state management, and command parsing into a simple, macro-based syntax, while exposing full native control for power users.

With the release of **v2.6.0**, this is the **largest update in the library's history**, introducing over 30 new features, a rewritten core for native performance, and a completely new ecosystem of tools.

---

## ⚡ Features at a Glance

*   **Native Performance**: Built strictly for Bun. Uses `Bun.serve`, `bun:sqlite`, and `node:zlib` for maximum speed.
*   **Macro System**: Logic-based command syntax (`s.if`, `s.db.set`) allows for rapid prototyping.
*   **SevenDB**: A built-in, zero-dependency Key-Value store powered by SQLite.
*   **Sharding Manager**: Scale your bot to thousands of servers with a single class.
*   **Web Dashboard**: Integrated HTTP server to monitor your bot's health in real-time.
*   **Native Voice**: Connect, speak, and play audio without external Java nodes (Lavalink optional).
*   **Developer Experience**: Typescript-first, Hot Reloading, and a dedicated CLI.

---

## 📥 Installation

```bash
bun add seven-discord
```

---

## 🚀 Quick Start

Create a file named `index.ts`:

```typescript
import { SevenClient } from "seven-discord";

const client = new SevenClient({
    token: "YOUR_BOT_TOKEN",
    // Intelligent Intents: No need to calculate bitfields.
    intents: ["SevenAll"]
});

// 1. A Simple Ping Command
client.cmd({
    name: "ping",
    description: "Checks latency",
    code: "Pong! 🏓 Gateway: $s.pingms | RAM: $s.ram"
});

// 2. Using the Database
client.cmd({
    name: "setstatus",
    code: `
    $s.db.set[userStatus;$s.arg[1]]
    ✅ Status saved: $s.db.get[userStatus]
    `
});

// 3. Native Button Interaction
client.cmd({
    name: "button",
    code: `
    $s.send[Click below!]
    $s.button[my_id;Click Me;Primary]
    `
});

// Handle the interaction
client.on({
    event: "interactionCreate",
    code: "$s.if[$s.customId == 'my_id'; $s.reply[Button Clicked!];]"
});

client.start();
```

---

## 📚 The Seven Ecosystem

### 1. The Macro Language
Seven-Discord uses a unique "Macro" syntax allowing you to embed logic directly into your strings.

*   **Logic**: `$s.if[condition;then;else]`, `$s.eq[a;b]`
*   **Variables**: `$s.var[name]`, `$s.setUserVar[name;value]`
*   **Utils**: `$s.random[1;100]`, `$s.math[10 + 5]`
*   **Discord**: `$s.username`, `$s.channelId`, `$s.ban[userId]`

### 2. SevenDB (Native Database)
Forget installing MongoDB or Redis for simple bots. v2.6.0 includes **SevenDB**, a high-performance wrapper around `bun:sqlite`.

```typescript
import { SevenDB } from "seven-discord";

const db = new SevenDB();
db.set("premium_users", ["123", "456"]);
const users = db.get("premium_users");
```

Inside commands:
```
$s.db.set[key;value]
$s.db.get[key]
$s.db.delete[key]
```

### 3. Sharding Manager
Scaling is now built-in. If your bot grows too large for one process, use the ShardingManager to spawn multiple instances.

```typescript
import { ShardingManager } from "seven-discord";

const manager = new ShardingManager("./index.ts", {
    totalShards: "auto" // Auto-detects CPU cores
});

manager.spawn();
```

### 4. Web Dashboard
Monitor your bot's memory usage, ping, and guild count via a built-in web interface.

```typescript
import { Dashboard } from "seven-discord";

// Starts a server at http://localhost:3000
new Dashboard(client, 3000).start();
```

### 5. Hot Reloading
Never restart your bot for a text change again.

*   **In-Code**: `client.reloadCommands()`
*   **Macro**: `$s.reload`
*   **Effect**: Clears the internal `require` cache and re-reads your command files.

---

## 🛠️ CLI Tools

The `seven` command-line tool is your companion for managing projects.

| Command | Description |
| :--- | :--- |
| `seven create <name>` | Scaffolds a new project with TypeScript support. |
| `seven doctor` | Checks environment health (FFmpeg, Node/Bun versions, RAM). |
| `seven test` | Runs unit tests for your macros. |
| `seven install <pkg>` | Installs packages from the Seven Registry. |

---

## ⚙️ Advanced Configuration

### Custom Events
You can now emit and listen to custom events for complex workflows.

```typescript
client.emitCustom("myCustomEvent", { data: "foo" });

client.on({
    event: "myCustomEvent",
    code: "$s.log[Received custom event!]"
});
```

### Granular Permissions
Security is a priority. Define exactly who can use a command.

```typescript
client.cmd({
    name: "nuke",
    permissions: ["ADMINISTRATOR"],
    code: "$s.channel.purge[100]"
});
```

### Performance (Zero-Copy & Zlib)
v2.6.0 introduces an internal optimization layer.
*   **Zlib**: We use `node:zlib` to decompress Gateway packets natively, reducing bandwidth by up to 60%.
*   **Zero-Copy**: Internal buffers utilize shared memory where possible to reduce Garbage Collection overhead.
*   **Anti-Crash**: Built-in handlers catch `uncaughtException` to keep your bot process alive.

---

## 📄 License
**MIT License**
Copyright © 2024-2025 Seven Team.

---

*This library is optimized for Bun. Usage with Node.js is possible but not recommended for maximum performance.*
