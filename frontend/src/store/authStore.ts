import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminInfo {
  id?: number;
  full_name: string;
  email: string;
  role: "admin" | "student";
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  admin: AdminInfo | null;
  isAuthenticated: boolean;
  setSession: (accessToken: string, refreshToken: string, admin: AdminInfo) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      admin: null,
      isAuthenticated: false,
      setSession: (accessToken, refreshToken, admin) =>
        set({ accessToken, refreshToken, admin, isAuthenticated: true }),
      setAccessToken: (token) => set({ accessToken: token }),
      logout: () =>
        set({ accessToken: null, refreshToken: null, admin: null, isAuthenticated: false }),
    }),
    { name: "matnite-auth" }
  )
);
