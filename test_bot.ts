
import { SevenClient, SecureToken } from "./src/index";

// V3.0.0 Test Bot
// Auto-retrieves token securely
const bot = new SevenClient({
    token: await SecureToken.get(),
    prefix: "!"
});

bot.cmd({
    name: "ping",
    code: "s.reply[Pong! 🏓]"
});

bot.cmd({
    name: "panel",
    code: `
    s.onInteraction[btn_click; s.reply[You clicked 🚀]]
    s.reply[
        s.embed[
            s.title[Panel]
            s.desc[Click below]
        ]
        s.row[
            s.button[Click; primary; btn_click; 🚀]
        ]
    ]
    `
});

// Slash Command
bot.cmdSlash({
    name: "hello",
    description: "Slash Hello",
    code: "s.reply[Hello Slash World!]"
});

bot.start();
