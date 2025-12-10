
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";
import { Interpreter } from "../../parser/Interpreter";
import { ReplyMacro } from "../../macros/core/Reply";

export class MessageCreateEvent extends Event {
    constructor() {
        super({
            name: "MESSAGE_CREATE", // Matches Gateway Dispatch name
            once: false
        });
    }

    async execute(client: SevenClient, data: any) {
        if (data.author.bot) return;

        const content: string = data.content;
        const prefix = client.prefix;

        if (!content.startsWith(prefix)) return;

        const args = content.slice(prefix.length).trim().split(" ");
        const commandName = args.shift()?.toLowerCase();

        // Access internal commands map (assuming public getter or we change SevenClient to expose it)
        // For now, we'll assume SevenClient has a public 'getCommand' or we access 'commands' if public.
        // Let's modify SevenClient to have a public getter or make commands public.
        // Ideally: client.commands.get(...)

        const cmd = (client as any).commands.get(commandName);

        if (cmd) {
            Logger.info(`Executing command: ${cmd.name}`);

            // 0. Cooldown Check
            if (cmd.cooldown > 0) {
                const now = Date.now();
                const key = `${data.author.id}-${cmd.name}`;
                const expiration = client.cooldowns.get(key);

                if (expiration && now < expiration) {
                    const timeLeft = ((expiration - now) / 1000).toFixed(1);
                    Logger.debug(`Command blocked by cooldown: ${timeLeft}s remaining`);
                    // Optional: Reply with cooldown message
                    await client.rest.post(`/channels/${data.channel_id}/messages`, {
                        content: `⏳ Please wait **${timeLeft}s** before using this command again.`,
                        message_reference: { message_id: data.id }
                    });
                    return;
                }

                // Set new cooldown
                client.cooldowns.set(key, now + (cmd.cooldown * 1000));
            }

            // 1. Run Middleware (only)
            if (cmd.only && cmd.only.length > 0) {
                for (const mw of cmd.only) {
                    const result = await mw(client, data);

                    if (result !== true) {
                        Logger.warn("Middleware blocked command execution.");
                        if (typeof result === "string") {
                            await client.rest.post(`/channels/${data.channel_id}/messages`, {
                                content: result,
                                message_reference: { message_id: data.id }
                            });
                        }
                        return; // Stop execution
                    }
                }
            }

            // 2. Execute Code (Interpreter)
            const context = {
                message: data,
                client: client,
                rest: client.rest
            };

            const output = await client.interpreter.parse(cmd.code, context);
            Logger.debug(`Interpreter Output for ${cmd.name}: [${output?.replace(/\n/g, "\\n")}]`);

            // Implicit Reply Logic:
            // If the code returns content (because s.reply wasn't used to consume it), we send it.
            if (output && output.trim().length > 0) {
                // Use static parsePayload from ReplyMacro (already imported at top in previous step)
                const payload = ReplyMacro.parsePayload(output);

                if (payload && (payload.content || (payload.embeds && payload.embeds.length > 0) || (payload.components && payload.components.length > 0))) {
                    payload.message_reference = { message_id: data.id };
                    try {
                        await client.rest.post(`/channels/${data.channel_id}/messages`, payload);
                    } catch (e: any) {
                        Logger.error(`Implicit Reply Failed: ${e.message}`);
                    }
                }
            }
        }
    }
}
