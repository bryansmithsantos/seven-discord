
import { SevenClient } from "../core/SevenClient";

// ⚠️ usage: bun run src/test/comprehensive_bot.ts
const bot = new SevenClient({
    token: process.env.DISCORD_TOKEN || "YOUR_TOKEN_HERE",
    prefix: "!"
});

// --- 1. SYSTEM & EVENTS ---
bot.setReady("s.log[Bot is READY!] s.setStatus[online; Testing Seven-Discord; 0]");

bot.on({
    event: "messageCreate",
    code: "s.if[s.includes[s.content; ping]; s.reply[Pong! (Event Triggered)]; ]"
});

// --- 2. ECONOMY ---
bot.cmd({
    name: "eco_test",
    code: `
        s.reply[
            s.embed[
                s.title[Economy Test]
                s.desc[Testing Economy Macros...]
            ]
        ]
        s.setCash[@user; 1000]
        s.reply[Set cash to 1000. Balance: s.cash[@user]]
        s.addCash[@user; 500]
        s.reply[Added 500. Balance: s.cash[@user]]
        s.removeCash[@user; 200]
        s.reply[Removed 200. Balance: s.cash[@user]]
    `
});

bot.cmd({
    name: "work",
    code: "s.work"
});

bot.cmd({
    name: "daily",
    code: "s.daily"
});

// --- 3. UI (EMBEDS & BUTTONS) ---
bot.cmd({
    name: "ui_test",
    code: `
        s.reply[
            s.embed[
                s.title[UI Showcase]
                s.desc[This embed tests the UI system.]
                s.color[#00ff00]
                s.embedImage[s.avatar[@user]]
                s.embedFooter[Seven-Discord Test]
            ]
            s.row[
                s.button[btn_primary; Primary; primary]
                s.button[btn_danger; Danger; danger]
                s.button[btn_success; Success; success]
            ]
            s.onInteraction[btn_primary; s.reply[Primary Clicked!]]
            s.onInteraction[btn_danger; s.reply[Danger Clicked!]]
            s.onInteraction[btn_success; s.reply[Success Clicked!]]
        ]
    `
});

// --- 4. MODALS (INTERACTIVE) ---
bot.cmd({
    name: "modal_test",
    code: `
        s.reply[
            s.embed[s.title[Modal Test] s.desc[Click to open modal]]
            s.row[s.button[open_modal; Open Modal; primary]]
            s.onInteraction[open_modal; 
                s.modal[my_modal; Test Modal]
                s.input[name_field; Your Name; short]
                s.input[age_field; Your Age; short]
            ]
            s.onInteraction[my_modal; s.reply[Submitted! Hello s.onInteraction[value]]] 
        ]
    `
    // Note: s.onInteraction[value] isn't implemented for modals yet in this basic mock script, 
    // but the modal should open.
});

// --- 5. LOGIC & MATH ---
bot.cmd({
    name: "math_test",
    code: `
        s.reply[
            s.embed[
                s.title[Math & Logic]
                s.field[1 + 1; s.math[1+1]; true]
                s.field[Random (1-100); s.randomInt[1;100]; true]
                s.field[PI; s.pi; true]
                s.field[Is 10 > 5?; s.gt[10;5]; true]
            ]
        ]
    `
});

// --- 6. MODERATION ---
bot.cmd({
    name: "mod_test",
    code: `
        s.reply[Testing basic mod macros (Simulated)...]
        s.warn[@user; Test Warning]
        s.reply[Warned @user. Warnings: s.warnings[@user]]
    `
});

bot.start();
