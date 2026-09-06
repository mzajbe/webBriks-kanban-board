import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validation";
import { env } from "../../config/env";
import { AppError } from "../../errors/AppError";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await authService.registerUser(validatedData);

      res.status(201).json({
        success: true,
        message: "Registration successful",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { accessToken, user } = await authService.loginUser(validatedData);

      const isProd = env.NODE_ENV === "production";
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(401, "Unauthorized: User payload missing");
      }

      const user = await authService.getAuthenticatedUser(userId);

      res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isProd = env.NODE_ENV === "production";
      res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
