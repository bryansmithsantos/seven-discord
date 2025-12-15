import { SevenClient } from "../core/SevenClient";
import { Logger } from "./Logger";

export class TestRunner {
    private client: SevenClient;

    constructor(client: SevenClient) {
        this.client = client;
    }

    public async runTest(name: string, macroCode: string, expectedOutput: string): Promise<boolean> {
        process.stdout.write(`\x1b[36mRunning Test:\x1b[0m ${name}... `);

        try {
            // Mock Context
            const result = await this.client.interpreter.parse(macroCode, {
                client: this.client,
                rest: this.client.rest,
                author: { id: "0000", username: "TestUser" },
                message: { content: macroCode, author: { id: "0000" } }
            });

            if (result === expectedOutput) {
                console.log("\x1b[32mPASS\x1b[0m");
                return true;
            } else {
                console.log("\x1b[31mFAIL\x1b[0m");
                console.log(`   Expected: "${expectedOutput}"`);
                console.log(`   Got:      "${result}"`);
                return false;
            }
        } catch (e: any) {
            console.log("\x1b[31mERROR\x1b[0m");
            console.log(`   ${e.message}`);
            return false;
        }
    }
}
