import { Macro } from "../Macro";

// --- USER ID ---
export class UserIdMacro extends Macro {
    constructor() { super({ name: "userId", description: "Get User ID", category: "user", aliases: ["authorID"] }); }
    async execute(ctx: any, ...args: string[]) {
        const target = args[0] ? (await ctx.client.rest.get(`/users/${args[0]}`).catch(() => { })) : (ctx.author || ctx.user);
        return target?.id || "";
    }
}

// --- USER TAG ---
export class UserTagMacro extends Macro {
    constructor() { super({ name: "userTag", description: "Get User Tag", category: "user" }); }
    async execute(ctx: any, ...args: string[]) {
        const target = args[0] ? (await ctx.client.rest.get(`/users/${args[0]}`).catch(() => { })) : (ctx.author || ctx.user);
        return target ? `${target.username}#${target.discriminator}` : "";
    }
}

// --- USER CREATED ---
export class UserCreatedMacro extends Macro {
    constructor() { super({ name: "userCreated", description: "Get account creation date", category: "user" }); }
    async execute(ctx: any, ...args: string[]) {
        const id = args[0] || (ctx.author || ctx.user)?.id;
        if (!id) return "";
        const timestamp = Number((BigInt(id) >> 22n) + 1420070400000n);
        return String(timestamp);
    }
}



// --- USER BOT ---
export class UserBotMacro extends Macro {
    constructor() { super({ name: "userBot", description: "Is user a bot?", category: "user" }); }
    async execute(ctx: any, ...args: string[]) {
        const target = args[0] ? (await ctx.client.rest.get(`/users/${args[0]}`).catch(() => { })) : (ctx.author || ctx.user);
        return target?.bot ? "true" : "false";
    }
}
