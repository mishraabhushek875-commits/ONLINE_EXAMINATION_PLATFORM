import { useMutation } from "@tanstack/react-query";
import authService from "../services/auth";
import { useAuthStore } from "../store/authStore";

// Step 1: Login → OTP trigger
export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
  });
};

// Step 2: OTP verify → token mila, store me daalo
export const useVerifyOtp = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: authService.verifyOtp,
    onSuccess: (response) => {
      const accessToken = response.data; // string token
      const refreshToken = response.person.refreshToken;
      login(accessToken, response.person);
      localStorage.setItem("refreshToken", refreshToken);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authService.resetPassword,
  });
};
