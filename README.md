
# Seven-Discord 🚀

**The most advanced macro-based framework for Discord Bots.**  
Built for speed. Optimized for Bun. Zero boilerplate.

---

## 📦 Installation
```bash
npm install seven-discord
```

## ⚡ Quick Start
```typescript
import { SevenClient } from "seven-discord";

const client = new SevenClient({
    token: "YOUR_TOKEN",
    intents: 3276799 // All Intents
});

client.cmd({
    name: "ping",
    code: "Pong! 🏓 Latency: s.pingms",
    aliases: ["p", "lat"], // New!
    cooldown: 5 // New!
});

client.start();
```

## 🔥 Key Features
- **Macro System**: Write complex logic in single lines (`s.if`, `s.math`, `s.db`).
- **Bun Native**: Millisecond startup times.
- **Key-Value Arguments**: `s.embed[title:Hello; color:red]`
- **Real-Time**: `s.time` for real world hours.
- **Easy UI**: `s.button`, `s.selectMenu`, `s.modal` made simple.
- **Aliases & Cooldowns**: Built-in command management.

## 📚 Documentation
[View Full Documentation](https://bryansmithsantos.github.io/seven-discord/)
*For now, open `docs/index.html` in your browser.*

## 🛠️ Advanced Usage

### Modals
```typescript
s.modal[id:apply; title:Application; 
    s.input[id:name; label:Your Name]
]
```

### Sending Messages
```typescript
s.send[CHANNEL_ID; Hello World!]
```

---

**Seven-Discord** — *Code Less. Build Faster.*
