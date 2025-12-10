
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";
import { Interpreter } from "../../parser/Interpreter";

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

            await client.interpreter.parse(cmd.code, context);
        }
    }
}
