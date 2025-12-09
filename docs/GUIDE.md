# 📘 Seven-Discord Learning Guide (v2.2)

Welcome to the future of bot coding.

> **New to Seven?**
> The easiest way to start is using our CLI tool:
> `bunx seven-discord --init --name minimal-bot`

## 1. The Bracket Syntax `[]`

In version 1.0, we used parenthesis `()`. In v2.0, we moved to **Brackets** `[]`.
Why? Because it allows us to parse spaces and complex arguments much easier.

**Old:** `s.reply(Hello World)`
**New:** `s.reply[Hello World]`

## 2. Variables

Variables do **not** use brackets. They are direct property accessors.
- `s.username` -> The name of the user who sent the message.
- `s.authorId` -> The ID of the user.
- `s.guildId` -> The ID of the server.

## 3. Arguments

To get arguments from a user's message (e.g. `!ban @User`), use `s.arg[N]`.
- `s.arg[1]` -> First word after command.
- `s.arg[2]` -> Second word.

## 4. Example: Valid Command

```typescript
bot.cmd({
    name: "say",
    code: `
    s.log[Say command triggered by s.username]
    s.reply[You said: s.arg[1]]
    `
})
```
## 5. Hot-Reload (Development)
Stop restarting your bot manually!
Run this command to watch for file changes and auto-restart:
```bash
bun run dev
```

## 6. Interactive UI (V3)
Buttons and Select Menus are easy. 
You can handle interactions **inside the same command**!

```typescript
bot.cmd({
    name: "panel",
    code: `
    s.onInteraction[btn_click; s.reply[Clicked! 🚀]]
    
    s.reply[
        s.embed[ s.title[My Panel] ]
        s.row[ s.button[Click Me; primary; btn_click] ]
    ]
    `
});
```
- `s.onInteraction`: Registers the handler. Silent (doesn't print text).
- `s.button`: Creates the button with the ID `btn_click`.

## 7. Database & Variables
Variables are saved automatically to `seven_db.json`.
- `s.setVar[coins; 100]` -> Global variable.
- `s.setVar[xp; 50; user]` -> User-specific variable.
- `s.getVar[xp; user]` -> Get it back.
