# Seven-Discord 🚀

<div align="center">
  <img src="https://raw.githubusercontent.com/bryansmithsantos/seven-discord/main/docs/logo.jpeg" alt="Logo" width="200" />
  <h1>The Future of Discord Bots</h1>
  <p><b>Create powerful, verified Discord bots in seconds. Including a powerful CLI.</b></p>
  
  <p>
    <a href="https://discord.gg/qpRjsjrXcx">
      <img src="https://img.shields.io/discord/1393341011396268133?color=5865F2&logo=discord&logoColor=white" alt="Discord Server" />
    </a>
    <img src="https://img.shields.io/badge/Bun-v1.0+-black?logo=bun" alt="Bun Version" />
    <img src="https://img.shields.io/npm/v/seven-discord?color=red" alt="NPM Version" />
  </p>
</div>

---

## 🔥 **Stop Writing Boilerplate.**
Seven-Discord isn't just a library; it's a **Framework**. We replaced thousands of lines of complex JavaScript with simple, powerful **Macros**.

| Feature | The Old Way (Discord.js) | The Seven Way |
| :--- | :--- | :--- |
| **Sending a Message** | `message.channel.send("Hello")` | `s.reply[Hello]` |
| **Embeds** | 15 lines of `new EmbedBuilder()` | `s.embed[ s.title[Hi] s.desc[Hello] ]` |
| **Logic** | Manual if/else statements | `s.if[ s.eq[1;1]; Yes; No ]` |
| **Setup** | 5 files, 20 imports | **1 Command.** |

---

## ⚡ **The Seven CLI** 
We built a state-of-the-art CLI to manage your projects.

### **1. Install Globally**
```bash
bun add -g seven-discord
```

### **2. Create a Project**
Interactive setup that builds your bot, installs dependencies, and configures VS Code IntelliSense.
```bash
seven --init --name MyBot
```

### **3. Start Coding**
```bash
cd MyBot
bun run dev
```

### **4. Documentation in Terminal**
Forget checking the website every 5 seconds.
```bash
seven --doc s.embed
seven --doc s.button
```

---

## 🛠️ **Usage Example**

```typescript
import { SevenClient, s } from "seven-discord";

const bot = new SevenClient({
    token: await s.envtoken("DISCORD_TOKEN"), 
    prefix: "!"
});

// A Simple Avatar Command
bot.cmd({
    name: "avatar",
    code: `
    s.embed[
        s.title[User Avatar]
        s.image[s.avatar[s.authorID]]
        s.color[#5865F2]
    ]
    s.button[Open in Browser; link; s.avatar[s.authorID]]
    `
    // Auto-reply handles the rest! 🪄
});

bot.start();
```

---

## 📚 **Documentation**
Visit our [**Official Wiki**](https://bryansmithsantos.github.io/seven-discord/index.html) for the full macro list.

---

<div align="center">
  <sub>Built with ❤️ by Ez using Bun.</sub>
</div>
