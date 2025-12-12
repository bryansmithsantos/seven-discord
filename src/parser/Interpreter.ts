
import { RESTManager } from "../rest/RESTManager";
import { Logger } from "../util/Logger";
import { Macro } from "../macros/Macro";

// Import Macros explicitly
import { ReplyMacro } from "../macros/core/Reply";
import { LogMacro } from "../macros/core/Log";
import { BanMacro } from "../macros/moderation/Ban";
import { EqMacro } from "../macros/logic/Eq";

export interface ExecutionContext {
    message?: any;
    interaction?: any;
    client: any;
    rest: any;
    guildId?: string;
    channelId?: string;
    author?: any;
    member?: any;
}

export class Interpreter {
    // Registry
    private macros: Map<string, Macro> = new Map();
    private client: any;

    constructor(client: any) {
        this.client = client;

        // Register Core
        this.register(new ReplyMacro());
        this.register(new LogMacro());
        this.register(new BanMacro());
        // Logic
        this.register(new EqMacro());
        this.register(new (require("../macros/logic/If").IfMacro)());
        this.register(new (require("../macros/logic/And").AndMacro)());
        this.register(new (require("../macros/logic/Or").OrMacro)());
        this.register(new (require("../macros/logic/Not").NotMacro)());
        this.register(new (require("../macros/logic/Gt").GtMacro)());
        this.register(new (require("../macros/logic/Lt").LtMacro)());
        this.register(new (require("../macros/logic/Gte").GteMacro)());
        this.register(new (require("../macros/logic/Lte").LteMacro)());
        this.register(new (require("../macros/logic/Ternary").TernaryMacro)());
        this.register(new (require("../macros/logic/Includes").IncludesMacro)());
        this.register(new (require("../macros/logic/IsNumber").IsNumberMacro)());

        // Math
        this.register(new (require("../macros/math/Math").MathMacro)());
        this.register(new (require("../macros/math/Random").RandomMacro)());
        this.register(new (require("../macros/math/Round").RoundMacro)());
        this.register(new (require("../macros/math/Floor").FloorMacro)());
        this.register(new (require("../macros/math/Ceil").CeilMacro)());
        this.register(new (require("../macros/math/Abs").AbsMacro)());
        this.register(new (require("../macros/math/Pow").PowMacro)());
        this.register(new (require("../macros/math/Sqrt").SqrtMacro)());
        this.register(new (require("../macros/math/Min").MinMacro)());
        this.register(new (require("../macros/math/Max").MaxMacro)());
        this.register(new (require("../macros/math/RandomInt").RandomIntMacro)());
        this.register(new (require("../macros/math/Pi").PiMacro)());

        // String
        this.register(new (require("../macros/string/Len").LenMacro)());
        this.register(new (require("../macros/string/Upper").UpperMacro)());
        this.register(new (require("../macros/string/Lower").LowerMacro)());
        this.register(new (require("../macros/string/Replace").ReplaceMacro)());
        this.register(new (require("../macros/string/ReplaceAll").ReplaceAllMacro)());
        this.register(new (require("../macros/string/Slice").SliceMacro)());
        this.register(new (require("../macros/string/Split").SplitMacro)());
        this.register(new (require("../macros/string/Trim").TrimMacro)());
        this.register(new (require("../macros/string/Capitalize").CapitalizeMacro)());
        this.register(new (require("../macros/string/Repeat").RepeatMacro)());
        this.register(new (require("../macros/string/StartsWith").StartsWithMacro)());
        this.register(new (require("../macros/string/EndsWith").EndsWithMacro)());
        this.register(new (require("../macros/string/Reverse").ReverseMacro)());

        // UI
        this.register(new (require("../macros/ui/Embed").EmbedMacro)());
        this.register(new (require("../macros/economy/RemoveCash").RemoveCashMacro)());
        this.register(new (require("../macros/economy/SetCash").SetCashMacro)());
        this.register(new (require("../macros/economy/Cash").CashMacro)());
        this.register(new (require("../macros/economy/Pay").PayMacro)());
        this.register(new (require("../macros/economy/SetCurrency").SetCurrencyMacro)());
        this.register(new (require("../macros/economy/Bank").BankMacro)());
        this.register(new (require("../macros/economy/Deposit").DepositMacro)());
        this.register(new (require("../macros/economy/Withdraw").WithdrawMacro)());
        this.register(new (require("../macros/economy/Give").GiveMacro)());
        this.register(new (require("../macros/economy/Take").TakeMacro)());
        this.register(new (require("../macros/economy/ResetEco").ResetEcoMacro)());
        this.register(new (require("../macros/economy/Work").WorkMacro)());
        this.register(new (require("../macros/economy/Daily").DailyMacro)());
        this.register(new (require("../macros/economy/Rob").RobMacro)());
        this.register(new (require("../macros/economy/Gamble").GambleMacro)());
        this.register(new (require("../macros/economy/Coinflip").CoinflipMacro)());
        this.register(new (require("../macros/economy/Leaderboard").LeaderboardMacro)());

        // Moderation
        this.register(new (require("../macros/moderation/Mute").MuteMacro)());
        this.register(new (require("../macros/moderation/Unmute").UnmuteMacro)());
        this.register(new (require("../macros/moderation/Purge").PurgeMacro)());
        this.register(new (require("../macros/moderation/Lock").LockMacro)());
        this.register(new (require("../macros/moderation/Unlock").UnlockMacro)());
        this.register(new (require("../macros/moderation/Slowmode").SlowmodeMacro)());
        this.register(new (require("../macros/moderation/Warn").WarnMacro)());
        this.register(new (require("../macros/moderation/Unwarn").UnwarnMacro)());
        this.register(new (require("../macros/moderation/Warnings").WarningsMacro)());

        // System
        this.register(new (require("../macros/system/Ping").PingMacro)());
        this.register(new (require("../macros/system/Uptime").UptimeMacro)());
        this.register(new (require("../macros/system/BotInfo").BotInfoMacro)());
        this.register(new (require("../macros/system/ServerInfo").ServerInfoMacro)());
        this.register(new (require("../macros/system/UserInfo").UserInfoMacro)());
        this.register(new (require("../macros/system/Avatar").AvatarMacro)());
        this.register(new (require("../macros/system/Shutdown").ShutdownMacro)());
        this.register(new (require("../macros/system/Eval").EvalMacro)());
        this.register(new (require("../macros/system/SetStatus").SetStatusMacro)());
        this.register(new (require("../macros/system/ShardId").ShardIdMacro)());
        this.register(new (require("../macros/system/GuildCount").GuildCountMacro)());
        this.register(new (require("../macros/system/UserCount").UserCountMacro)());
        this.register(new (require("../macros/system/ChannelCount").ChannelCountMacro)());
        this.register(new (require("../macros/system/EmojiCount").EmojiCountMacro)());
        this.register(new (require("../macros/system/RoleCount").RoleCountMacro)());
        this.register(new (require("../macros/system/ClientID").ClientIDMacro)());
        this.register(new (require("../macros/system/OwnerID").OwnerIDMacro)());
        this.register(new (require("../macros/system/Ram").RamMacro)());
        this.register(new (require("../macros/system/Cpu").CpuMacro)());
        this.register(new (require("../macros/system/Os").OsMacro)());
        this.register(new (require("../macros/system/NodeVersion").NodeVersionMacro)());
        this.register(new (require("../macros/system/Date").DateMacro)());
        this.register(new (require("../macros/system/Timestamp").TimestampMacro)());

        // UI
        this.register(new (require("../macros/ui/Embed").EmbedMacro)());
        this.register(new (require("../macros/ui/EmbedHelpers").EmbedTitleMacro)());
        this.register(new (require("../macros/ui/EmbedHelpers").EmbedDescMacro)());
        this.register(new (require("../macros/ui/EmbedHelpers").EmbedColorMacro)());
        this.register(new (require("../macros/ui/EmbedHelpers").EmbedImageMacro)());
        this.register(new (require("../macros/ui/EmbedHelpers").EmbedThumbMacro)());
        this.register(new (require("../macros/ui/EmbedHelpers").EmbedFooterMacro)());
        this.register(new (require("../macros/ui/EmbedHelpers").EmbedFieldMacro)());
        this.register(new (require("../macros/ui/EmbedHelpers").EmbedAuthorMacro)());
        this.register(new (require("../macros/ui/EmbedHelpers").EmbedUrlMacro)());
        this.register(new (require("../macros/ui/EmbedHelpers").EmbedTimestampMacro)());

        this.register(new (require("../macros/ui/Button").ButtonMacro)());
        this.register(new (require("../macros/ui/Row").RowMacro)());
        this.register(new (require("../macros/ui/SelectMenu").SelectMenuMacro)());
        this.register(new (require("../macros/ui/SelectOption").SelectOptionMacro)());
        this.register(new (require("../macros/ui/OnInteraction").OnInteractionMacro)());
        this.register(new (require("../macros/ui/Modal").ModalMacro)());
        this.register(new (require("../macros/ui/Input").InputMacro)());

        // Core / New
        this.register(new (require("../macros/core/Send").SendMacro)());
        this.register(new (require("../macros/system/Time").TimeMacro)());
        this.register(new (require("../macros/system/Cooldown").CooldownMacro)());
        this.register(new (require("../macros/ui/Defer").DeferMacro)());
        this.register(new (require("../macros/ui/UpdateInteraction").UpdateInteractionMacro)());

        Logger.info("Interpreter System initialized.");
    }

    public register(macro: Macro) {
        this.macros.set(macro.name.toLowerCase(), macro);
        if (macro.aliases) {
            macro.aliases.forEach(a => this.macros.set(a.toLowerCase(), macro));
        }
    }

    public async parse(content: string, ctx: ExecutionContext): Promise<string | undefined> {
        if (!content) return "";
        let finalContent = content;

        while (true) {
            // Find start of a macro: s.Name
            const startIndex = finalContent.search(/s\.[a-zA-Z0-9]+/);
            if (startIndex === -1) break;

            const nameMatch = finalContent.substring(startIndex).match(/s\.([a-zA-Z0-9]+)/);
            if (!nameMatch) break;

            const name = nameMatch[1];
            const fullMacroStart = startIndex;
            let fullMacroEnd = startIndex + nameMatch[0].length;
            let argsRaw = "";

            if (fullMacroEnd < finalContent.length && finalContent[fullMacroEnd] === '[') {
                let depth = 1;
                let argStartIndex = fullMacroEnd + 1;
                let currentIndex = argStartIndex;

                // Find matching closing bracket
                while (depth > 0 && currentIndex < finalContent.length) {
                    if (finalContent[currentIndex] === '[') depth++;
                    else if (finalContent[currentIndex] === ']') depth--;
                    currentIndex++;
                }

                if (depth === 0) {
                    argsRaw = finalContent.substring(argStartIndex, currentIndex - 1);
                    fullMacroEnd = currentIndex;
                } else {
                    break;
                }
            }

            const isMention = startIndex > 0 && finalContent[startIndex - 1] === '@';

            // Check if macro prohibits nested parsing
            const macro = this.macros.get(name.toLowerCase());
            let shouldParseArgs = true;
            if (macro && macro.disableNestedParsing) {
                shouldParseArgs = false;
            }

            // Recursion: Parse the args first (Inner-to-Outer) IF allowed
            if (shouldParseArgs && argsRaw && argsRaw.includes("s.")) {
                const parsedArgs = await this.parse(argsRaw, ctx);
                if (parsedArgs !== undefined) argsRaw = parsedArgs;
            }

            const replacement = await this.executeMacro(name, argsRaw, ctx);
            const replacementStr = String(replacement !== undefined ? replacement : "");

            // Smart Mention Handing
            let finalReplacement = replacementStr;
            let replaceStart = fullMacroStart;

            if (isMention) {
                if (/^\d{17,20}$/.test(replacementStr)) {
                    // Replace @s.user -> <@123456>
                    finalReplacement = `<@${replacementStr}>`;
                    replaceStart = startIndex - 1; // Include '@'
                }
            }

            // Replace in string
            finalContent = finalContent.substring(0, replaceStart) + finalReplacement + finalContent.substring(fullMacroEnd);
        }

        return finalContent;
    }

    private async executeMacro(name: string, argsRaw: string | undefined, ctx: ExecutionContext): Promise<string | void> {
        // 1. Check Registry
        const macro = this.macros.get(name.toLowerCase());

        if (macro) {
            const args = argsRaw ? argsRaw.split(";").map(a => a.trim()) : [];
            return await macro.execute(ctx, ...args);
        }

        // 2. Hardcoded Properties
        switch (name) {
            case "authorId":
            case "authorID": return ctx.author?.id || ctx.message?.author?.id || ctx.interaction?.member?.user?.id;
            case "username": return ctx.author?.username || ctx.message?.author?.username || ctx.interaction?.member?.user?.username;
            case "content": return ctx.message?.content;
            case "serverName": return ctx.message?.guild_id || ctx.interaction?.guild_id;
            case "channelId": return ctx.message?.channel_id || ctx.interaction?.channel_id;
            case "arg":
                if (!argsRaw || !ctx.message) return "";
                const index = parseInt(argsRaw) || 1;
                const cmdArgs = ctx.message.content.split(" ").slice(1);
                return cmdArgs[index - 1] || "";
            default:
                return undefined;
        }
    }
}
