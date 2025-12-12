export const Intents = {
    SevenGuild: 1 << 0,
    SevenMembers: 1 << 1,
    SevenBans: 1 << 2,
    SevenEmojis: 1 << 3,
    SevenIntegrations: 1 << 4,
    SevenWebhooks: 1 << 5,
    SevenInvites: 1 << 6,
    SevenVoice: 1 << 7,
    SevenPresences: 1 << 8,
    SevenMessages: 1 << 9,
    SevenReactions: 1 << 10,
    SevenTyping: 1 << 11,
    SevenDirectMessages: 1 << 12,
    SevenDirectReactions: 1 << 13,
    SevenDirectTyping: 1 << 14,
    SevenMessageContent: 1 << 15,
    SevenScheduledEvents: 1 << 16,
    SevenAutoModConfig: 1 << 20,
    SevenAutoModExec: 1 << 21,
    SevenAll: 3276799
};

export type IntentFlag = keyof typeof Intents;
