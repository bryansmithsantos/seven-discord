/**
 * Seven-Discord Constants
 * Defines the core values for the library.
 */

export const Constants = {
    // Discord API
    GATEWAY_URL: "wss://gateway.discord.gg/?v=10&encoding=json",
    API_BASE: "https://discord.com/api/v10",

    // Library Defaults
    LIBRARY_NAME: "Seven-Discord",
    VERSION: "1.0.0",

    // OpCodes
    OPCODES: {
        DISPATCH: 0,
        HEARTBEAT: 1,
        IDENTIFY: 2,
        PRESENCE_UPDATE: 3,
        VOICE_STATE_UPDATE: 4,
        RESUME: 6,
        RECONNECT: 7,
        REQUEST_GUILD_MEMBERS: 8,
        INVALID_SESSION: 9,
        HELLO: 10,
        HEARTBEAT_ACK: 11,
    },

    // Intents (Defaults to All non-privileged + MessageContent for ease of use)
    // 53608447 = 513 (GUILDS + GUILD_MESSAGES) | 32768 (MESSAGE_CONTENT) | ...
    // For 'Seven', we try to be helpful. 
    DEFAULT_INTENTS: 3276799, // Practically everything for a standard bot
} as const;
