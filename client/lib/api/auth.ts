import { apiClient } from "./client";
import { RegisterPayload, LoginPayload, AuthResponse } from "@/types/auth";

export const authApi = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>("/auth/logout", {
      method: "POST",
    });
  },

  async getCurrentUser(): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/auth/me", {
      method: "GET",
    });
  },
};
