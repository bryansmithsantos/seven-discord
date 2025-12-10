# Seven-Discord The Framework 🚀

<div align="center">
  <img src="https://raw.githubusercontent.com/bryansmithsantos/seven-discord/main/docs/logo.jpeg" alt="Logo" width="220" />
  <h1>v2.5.10 - The "Framework" Update</h1>
  <p><b>Build verified Discord bots with 95% less code.</b></p>
  
  <p>
    <a href="https://discord.gg/qpRjsjrXcx">
      <img src="https://img.shields.io/discord/1393341011396268133?color=5865F2&logo=discord&logoColor=white" alt="Discord Server" />
    </a>
    <img src="https://img.shields.io/npm/v/seven-discord?color=red&logo=npm" alt="NPM Version" />
    <img src="https://img.shields.io/badge/Bun-v1.0+-black?logo=bun" alt="Bun Version" />
    <img src="https://img.shields.io/badge/Zero-Dependencies-green" alt="Zero Dependencies" />
  </p>
</div>

---

## 🔥 **Rethink Bot Development**

Seven-Discord isn't just a library. It's a **Macro-Based Framework** designed for speed, security, and simplicity. We abstract away the complexity of the Discord API so you can focus on **Logic**.

| Feature | The Old Way (Discord.js) | The Seven Way |
| :--- | :--- | :--- |
| **Sending a Message** | `message.channel.send("Hello")` | `s.reply[Hello]` |
| **Embeds** | 15 lines of `new EmbedBuilder()` | `s.embed[ s.title[Hi] s.desc[Hello] ]` |
| **Buttons** | `new ButtonBuilder().setLabel(...)` | `s.button[Click Me; primary; id]` |
| **Interactions** | Complex `InteractionCollector` | `s.onInteraction[id; s.reply[Clicked!]]` |
| **Economy** | Write your own DB wrapper | `s.addCash[100; s.authorID]` (Built-in) |
| **Setup** | 5 files, 20 imports | **1 Command.** |

---

## 📦 **Installation & CLI**

We recommend using our CLI to scaffold your project.

### **1. Global Install**
```bash
bun add -g seven-discord
```

### **2. Create Project**
Follow the interactive setup to name your bot and install VS Code snippets.
```bash
seven --init --name MyBot
```

### **3. Run**
```bash
cd MyBot
bun run dev
```

> **Manual Install:** `bun add seven-discord`

---

## 🛠️ **Advanced Usage: Interactive System**

Create a full dashboard with buttons and interaction handling in **one command**.

```typescript
import { SevenClient, s } from "seven-discord";

const bot = new SevenClient({
    token: await s.envtoken("DISCORD_TOKEN"), 
    prefix: "!"
});

// The Dashboard Command
bot.cmd({
    name: "dashboard",
    code: `
    s.embed[
        s.title[User Dashboard]
        s.desc[Welcome, s.username! Select an action below.]
        s.color[#5865F2]
        s.thumb[s.avatar[s.authorID]]
        s.footer[Balance: s.cash[s.authorID] coins]
    ]
    s.row[
        s.button[Daily Reward; success; btn_daily; 🎁]
        s.button[Check Bank; primary; btn_bank; 🏦]
        s.button[Delete; danger; btn_del; 🗑️]
    ]
    `
});

// The Interaction Logic (Handlers)
bot.cmd({
    name: "handlers",
    code: `
    s.onInteraction[btn_daily; 
        s.addCash[100; s.authorID]
        s.reply[You claimed your daily reward! 💰]
    ]
    
    s.onInteraction[btn_bank; 
        s.reply[Your Bank Balance: s.bank[s.authorID]]
    ]
    
    s.onInteraction[btn_del;
        s.reply[Dashboard closed.]
    ]
    `
    // Note: In v3, interactions will be handled inside the main command too.
});

bot.start();
```

---

## 📚 **Macro Reference**

### **Core & Logic**
| Macro | Arguments | Description |
| :--- | :--- | :--- |
| `s.reply` | `[Content]` | Replies to the message/interaction. |
| `s.log` | `[Text]` | Logs text to the console. |
| `s.setVar` | `[Key; Value]` | Sets a global variable. |
| `s.getVar` | `[Key]` | Gets a global variable. |
| `s.if` | `[Cond; True; False]` | Basic conditional logic. |
| `s.eq` | `[A; B]` | Checks if A equals B. |
| `s.math` | `[Expression]` | Evaluates math (e.g., `10+5`). |
| `s.random` | `[Min; Max]` | Returns random number. |

### **UI & Components**
| Macro | Arguments | Description |
| :--- | :--- | :--- |
| `s.embed` | `[Properties...]` | Creates an embed. |
| `s.title` | `[Text]` | Sets embed title. |
| `s.desc` | `[Text]` | Sets embed description. |
| `s.color` | `[Hex]` | Sets embed color. |
| `s.image` | `[URL]` | Sets embed image. |
| `s.button` | `[Label; Style; ID; Emoji]` | Creates a button. |
| `s.row` | `[Components...]` | Wraps components in a row. |
| `s.onInteraction`| `[ID; Code]` | Registers code to run when ID is triggered. |

### **Economy & Moderation**
| Macro | Arguments | Description |
| :--- | :--- | :--- |
| `s.addCash` | `[Amt; ID]` | Adds money to a user. |
| `s.pay` | `[Amt; ID]` | Transfers money. |
| `s.bank` | `[ID]` | Gets bank balance. |
| `s.ban` | `[ID; Reason]` | Bans a user. |
| `s.kick` | `[ID; Reason]` | Kicks a user. |
| `s.mute` | `[ID; Time; Reason]` | Mutes a user. |
| `s.purge` | `[Amount]` | Deletes messages. |

### **System & Utility**
`s.ping`, `s.uptime`, `s.botInfo`, `s.serverInfo`, `s.userInfo`, `s.avatar`, `s.eval`, `s.setStatus`

---

<div align="center">
  <sub>Built with ❤️ by Ez using Bun.</sub>
</div>
