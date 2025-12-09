
# Seven-Discord 🚀

<div align="center">
  <img src="docs/logo.jpeg" alt="Logo" width="200" />
  <h1>v2.1.0 Major Release</h1>
  <p>The simplest, zero-dependency Discord library for Bun. Now with <b>Interactive UI</b> & <b>Economy</b>.</p>
  <p>
    <a href="https://discord.gg/qpRjsjrXcx">
      <img src="https://img.shields.io/discord/1393341011396268133?color=5865F2&logo=discord&logoColor=white" alt="Discord Server" />
    </a>
  </p>
</div>

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

## 📦 Installation

});

// Interactive UI Command
bot.cmd({
    name: "panel",
    code: `
    s.reply[
        s.embed[
            s.title[Control Panel v3.0]
            s.desc[Welcome to the future.]
            s.color[#5865F2]
        ]
        s.row[
            s.button[Click Me; primary; btn_click; 🚀]
            s.button[Danger; danger; btn_danger; 💀]
        ]
    ]
    `
});

// Interaction Logic (Persistent)
bot.cmd({
    name: "setup",
    code: `
    s.onInteraction[btn_click; s.reply[You clicked the rocket!]]
    s.onInteraction[btn_danger; s.reply[Run away!]]
    s.reply[Interactions Ready!]
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

## 📚 Documentation

We have a beautiful "Wiki-Style" documentation website included in `docs/index.html`. 
Open it in your browser to explore all Macros and Events!

## 🤝 Contributing

This project is open-source. Feel free to submit PRs for new Macros!
