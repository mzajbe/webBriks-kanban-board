import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), ".env") });

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable missing: ${key}`);
  }
  return value;
};

export const env = {
  PORT: parseInt(getEnv("PORT", "5000"), 10),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  DATABASE_URL: getEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db"),
  JWT_SECRET: getEnv("JWT_SECRET", "demo-secret-change-this"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "7d"),
  FRONTEND_URL: getEnv("FRONTEND_URL", "http://localhost:3000"),
};
