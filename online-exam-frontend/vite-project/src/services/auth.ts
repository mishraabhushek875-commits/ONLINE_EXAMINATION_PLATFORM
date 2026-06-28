import api from "./api";
import type {
  RegisterPayload,
  LoginPayload,
  VerifyOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyOtpResponse,
  RefreshTokenResponse,
  MessageResponse,
} from "../types/auth.types";

const authService = {
  register: async (payload: RegisterPayload): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>("/auth/register", payload);
    return data;
  },

  // Login sirf OTP trigger karta hai, token nahi deta
  login: async (payload: LoginPayload): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>("/auth/login", payload);
    return data;
  },

  // Yahi se actual token milta hai
  verifyOtp: async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const { data } = await api.post<VerifyOtpResponse>(
      "/auth/verify-otp",
      payload,
    );
    return data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const { data } = await api.post<RefreshTokenResponse>(
      "/auth/refresh-token",
      { refreshToken },
    );
    return data;
  },

  forgotPassword: async (
    payload: ForgotPasswordPayload,
  ): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>(
      "/auth/forgot-password",
      payload,
    );
    return data;
  },

  resetPassword: async (
    payload: ResetPasswordPayload,
  ): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>(
      "/auth/reset-password",
      payload,
    );
    return data;
  },
};

export default authService;
