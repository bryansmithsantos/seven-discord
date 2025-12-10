/**
 * REST Manager
 * Handles HTTP requests to Discord with basic Rate Limit protection.
 */

import { Constants } from "../core/Constants";
import { Logger } from "../util/Logger";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export class RESTManager {
    private token: string;
    private queue: Promise<void> = Promise.resolve();

    constructor(token: string) {
        this.token = token;
    }

    /**
     * Make a request to the Discord API.
     * Automatically handles simple rate limits by chaining promises.
     */
    public async request(method: RequestMethod, endpoint: string, body?: any): Promise<any> {
        // Chain requests to avoid overwhelming the API (Simple Global Queue)
        // Production wise, this should be per-route, but for "Seven" simplicity:
        return (this.queue = this.queue.then(async () => {
            const url = `${Constants.API_BASE}${endpoint}`;
            Logger.debug(`${method} ${endpoint}`);

            const headers = {
                "Authorization": `Bot ${this.token}`,
                "Content-Type": "application/json",
                "User-Agent": `${Constants.LIBRARY_NAME} (${Constants.VERSION})`
            };

            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            });

            // Handle Rate Limits
            if (response.status === 429) {
                const data = await response.json();
                const retryAfter = (data as any).retry_after || 1;

                // If it's the Slash Command PUT (global rate limit often hit on restarts)
                // Just wait silently or log debug, don't scare user.
                if (endpoint.includes("/commands")) {
                    Logger.debug(`Slash Sync Rate Limited (${retryAfter}s). Waiting quietly...`);
                } else {
                    Logger.warn(`Rate Limited! Waiting ${retryAfter}s...`);
                }

                // Wait and retry
                await new Promise(r => setTimeout(r, retryAfter * 1000));
                return this.request(method, endpoint, body); // Retry recursively
            }

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Discord API Error ${response.status}: ${error}`);
            }

            // Return JSON if content exists
            if (response.headers.get("content-type")?.includes("application/json")) {
                return response.json();
            }
            return true;
        }));
    }

    public post(endpoint: string, body: any) {
        return this.request("POST", endpoint, body);
    }

    public get(endpoint: string) {
        return this.request("GET", endpoint);
    }

    public put(endpoint: string, body?: any) {
        return this.request("PUT", endpoint, body);
    }

    public delete(endpoint: string) {
        return this.request("DELETE", endpoint);
    }
}
