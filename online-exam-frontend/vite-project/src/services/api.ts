import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    // authStore "auth-storage" key mein { state: { token: "..." } } save karta hai
    // isliye seedha wahan se padho
    try {
      const raw = localStorage.getItem("auth-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore parse errors
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Auto refresh on 401 ──────────────────────────────────────────
// Ek time pe sirf ek hi /auth/refresh-token call jaaye — agar multiple
// requests ek saath 401 dein, baaki sab pehle wale refresh ka result wait karein.
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function logoutAndRedirect() {
  useAuthStore.getState().logout();
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;

    // 401 nahi hai, ya yeh request already retry ho chuki hai → seedha reject
    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (!storedRefreshToken) {
      logoutAndRedirect();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // Pehle se koi refresh chal raha hai — uska result wait karo, dobara call mat karo
      return new Promise((resolve, reject) => {
        refreshSubscribers.push((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post(
        `${api.defaults.baseURL}/auth/refresh-token`,
        { refreshToken: storedRefreshToken },
      );
      const newAccessToken = data.accessToken;

      const currentUser = useAuthStore.getState().user;
      useAuthStore.getState().login(newAccessToken, currentUser);

      isRefreshing = false;
      onRefreshed(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      onRefreshed(null);
      logoutAndRedirect();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
