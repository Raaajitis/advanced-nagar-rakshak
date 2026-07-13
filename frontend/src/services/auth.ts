import { api } from "@/lib/api";
import { User } from "@/types";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export const authService = {
  login: async (credentials: Record<string, any>): Promise<User> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data.data;
  },

  register: async (userData: Record<string, any>): Promise<User> => {
    const response = await api.post<RegisterResponse>("/auth/register", userData);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post<LogoutResponse>("/auth/logout");
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<ProfileResponse>("/auth/profile");
    return response.data.data;
  },
};
