import api from "./api";
import { ApiResponse, User } from "@/types";

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ message: string }>("/auth/login", { email, password }),

  verifyOtp: (email: string, otp: string) =>
    api.post<{
      message: string;
      data: string;
      person: Partial<User> & { refreshToken?: string };
    }>("/auth/verify-otp", { email, otp }),

  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }),

  resetPassword: (email: string, otp: string, newPassword: string) =>
    api.post("/auth/reset-password", { email, otp, newPassword }),
};
