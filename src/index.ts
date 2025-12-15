// Core
export * from "./core/SevenClient";
export * from "./core/Database";

// Managers
export * from "./managers/SlashManager";
export * from "./managers/PluginManager";
export * from "./managers/VoiceManager";
export * from "./managers/LanguageManager";

// Structures
export * from "./structures/Command";
export * from "./structures/Event";
export * from "./structures/Middleware";
export * from "./structures/SevenDB";
export * from "./structures/SlashBuilder";

// Utils
export * from "./util/Logger";
export * from "./util/SecureToken";
export * from "./util/TestRunner";

// Web
export * from "./web/Dashboard";
export * from "./sharding/ShardingManager";

// Optimization
export * from "./gateway/CompressionHandler";
export * from "./structures/LRUCache";
export * from "./util/AntiCrash";
export * from "./managers/PermissionManager";
export * from "./managers/EventManager";

// Featherweight (Optimization II)
export * from "./compiler/JITCompiler";
export * from "./compiler/TreeShaker";
export * from "./util/ZeroCopy";
export * from "./util/Heap";

import { SecureToken } from "./util/SecureToken";

export const s = {
    envtoken: SecureToken.get.bind(SecureToken)
};

export * from "./macros/Macro";
// export * from "./gateway/GatewayManager"; // Internal usually, but exposing for advanced users
