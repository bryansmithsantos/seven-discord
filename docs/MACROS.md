
# ⚡ Macro Reference (v2.1)

All macros now use the `[]` syntax.

| Macro | Description | Category | Example |
| :--- | :--- | :--- | :--- |
| `s.reply[Text]` | Replies to the message. | Core | `s.reply[Hello!]` |
| `s.log[Text]` | Logs to console. | Core | `s.log[Debug]` |
| `s.ban[UserID; Reason]` | Bans a user. | Moderation | `s.ban[123; Spam]` |
| `s.kick[UserID; Reason]` | Kicks a user. | Moderation | `s.kick[123; Bye]` |

## Logic & Variables
| Macro | Description | Example |
| :--- | :--- | :--- |
| `s.setVar[Name; Value; Type; ID]` | Sets a variable (Type: global, guild, user). | `s.setVar[xp; 10; user]` |
| `s.getVar[Name; Type; ID]` | Gets a variable. | `s.getVar[xp; user]` |
| `s.if[A; Op; B; Then; Else]` | Coming Soon (Use s.eq for now). | - |

## Economy Pack
| Macro | Description | Example |
| :--- | :--- | :--- |
| `s.cash` | View your balance (Wallet/Bank). | `s.cash` |
| `s.pay[User; Amount]` | Pay another user. | `s.pay[@User; 100]` |
| `s.addCash[User; Amount]` | Admin: Add money. | `s.addCash[@User; 500]` |
| `s.removeCash[User; Amount]` | Admin: Remove money. | `s.removeCash[@User; 500]` |
| `s.setCash[User; Amount]` | Admin: Set exact money. | `s.setCash[@User; 0]` |
| `s.bank` | View bank balance. | `s.bank` |
| `s.deposit[Amount/all]` | Deposit to bank. | `s.deposit[all]` |
| `s.withdraw[Amount/all]` | Withdraw from bank. | `s.withdraw[50]` |

## UI & Interactions (V3)
| Macro | Description | Example |
| :--- | :--- | :--- |
| `s.embed[Content]` | Creates an embed container. | `s.embed[ s.title[Hi] ]` |
| `s.title[Text]` | Set Embed Title (Nested). | `s.title[Welcome]` |
| `s.desc[Text]` | Set Embed Description (Nested). | `s.desc[Content]` |
| `s.color[Hex]` | Set Embed Color (Nested). | `s.color[#FF0000]` |
| `s.image[URL]` | Set Embed Image (Nested). | `s.image[http...]` |
| `s.row[Components]` | Creates a component row. | `s.row[ s.button[...] ]` |
| `s.button[Label; Style; ID; Emoji]` | Creates a button. | `s.button[Click; primary; id; 🚀]` |
| `s.selectMenu[ID; Placeholder; Options]` | Creates a dropdown. | `s.selectMenu[menu; Pick one; ...]` |
| `s.option[Label; Value; Desc; Emoji]` | Option for Select Menu. | `s.option[Red; red; Color Red; 🔴]` |
| `s.onInteraction[ID; Code]` | Registers interaction handler. | `s.onInteraction[btn_click; ...]` |

## System
| Macro | Description | Example |
| :--- | :--- | :--- |
| `s.ping` | Bot latency. | `s.ping` |
| `s.uptime` | Bot uptime. | `s.uptime` |
| `s.botInfo` | RAM/CPU Usage. | `s.botInfo` |
| `s.serverInfo` | Guild Stats. | `s.serverInfo` |
| `s.userInfo` | User Stats. | `s.userInfo` |
| `s.eval[Code]` | Eval JS (Dangerous). | `s.eval[process.exit()]` |

## Variables
| Variable | Description |
| :--- | :--- |
| `s.username` | Author's username |
| `s.authorId` | Author's ID |
| `s.content` | Message content |
| `s.guildId` | Server ID |
| `s.arg[N]` | Command argument |
