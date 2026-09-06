"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const env_1 = require("./app/config/env");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const app = (0, express_1.default)();
// Trust proxy for secure cookies over reverse proxies (Vercel, Render, Railway)
app.set("trust proxy", 1);
// Global Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        if (!origin)
            return callback(null, true);
        const allowedOrigins = [
            env_1.env.FRONTEND_URL,
            env_1.env.FRONTEND_URL.replace(/\/$/, ""),
            "http://localhost:3000",
        ];
        if (allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
            return callback(null, true);
        }
        return callback(null, true); // Allow Vercel preview deployments
    },
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Application Routes (support both /api/* and direct root /* routing on Vercel)
app.use("/api", routes_1.default);
app.use("/", routes_1.default);
// Root Route
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Mini Kanban API",
    });
});
// Global Error Handler
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
