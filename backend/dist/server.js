"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
const prisma_1 = __importDefault(require("./app/config/prisma"));
let server;
async function main() {
    try {
        // 1. Connect to PostgreSQL via Prisma Client
        await prisma_1.default.$connect();
        console.log("Database connected successfully.");
        // 2. Start HTTP server after successful database connection
        server = app_1.default.listen(env_1.env.PORT, () => {
            console.log(`Server running on http://localhost:${env_1.env.PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    }
}
// Graceful shutdown helper
const gracefulShutdown = async (signal) => {
    console.log(`Received ${signal}. Shutting down cleanly...`);
    try {
        if (server) {
            server.close(async () => {
                console.log("HTTP server closed.");
                await prisma_1.default.$disconnect();
                console.log("Prisma client disconnected.");
                process.exit(0);
            });
        }
        else {
            await prisma_1.default.$disconnect();
            console.log("Prisma client disconnected.");
            process.exit(0);
        }
    }
    catch (err) {
        console.error("Error during graceful shutdown:", err);
        process.exit(1);
    }
};
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
main();
