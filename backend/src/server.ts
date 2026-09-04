import { Server } from "http";
import app from "./app";
import { env } from "./app/config/env";
import prisma from "./app/config/prisma";

let server: Server;

async function main() {
  try {
    // 1. Connect to PostgreSQL via Prisma Client
    await prisma.$connect();
    console.log("Database connected successfully.");

    // 2. Start HTTP server after successful database connection
    server = app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
}

// Graceful shutdown helper
const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down cleanly...`);
  try {
    if (server) {
      server.close(async () => {
        console.log("HTTP server closed.");
        await prisma.$disconnect();
        console.log("Prisma client disconnected.");
        process.exit(0);
      });
    } else {
      await prisma.$disconnect();
      console.log("Prisma client disconnected.");
      process.exit(0);
    }
  } catch (err) {
    console.error("Error during graceful shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

main();
