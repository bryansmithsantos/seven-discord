import { SevenClient } from "../core/SevenClient";
import { Logger } from "../util/Logger";

export class Dashboard {
    private client: SevenClient;
    private port: number;

    constructor(client: SevenClient, port: number = 3000) {
        this.client = client;
        this.port = port;
    }

    public start() {
        Bun.serve({
            port: this.port,
            fetch: (req) => this.handleRequest(req),
        });
        Logger.info(`[Dashboard] Started on http://localhost:${this.port}`);
    }

    private handleRequest(req: Request): Response {
        const url = new URL(req.url);

        if (url.pathname === "/") {
            return new Response(this.getHomeHTML(), {
                headers: { "Content-Type": "text/html" },
            });
        }

        if (url.pathname === "/api/stats") {
            const stats = {
                guilds: this.client.gateway.guilds.size,
                ping: this.client.gateway.ping,
                uptime: process.uptime(),
                ram: process.memoryUsage().rss,
            };
            return new Response(JSON.stringify(stats), {
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response("Not Found", { status: 404 });
    }

    private getHomeHTML(): string {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Seven-Discord Dashboard</title>
    <style>
        body { background: #000; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: #111; padding: 2rem; border-radius: 12px; border: 1px solid #222; text-align: center; }
        h1 { margin-bottom: 0.5rem; color: #3b82f6; }
        .stat { font-size: 2rem; font-weight: bold; margin: 1rem 0; }
        .label { color: #888; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Seven-Discord</h1>
        <div class="label">Status</div>
        <div class="stat" style="color: #22c55e">ONLINE</div>
        <div class="label">Guilds</div>
        <div class="stat">${this.client.gateway.guilds.size}</div>
    </div>
</body>
</html>
        `;
    }
}
