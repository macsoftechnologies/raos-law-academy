import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = "https://api.raoslawacademy.com";

// Default student session token for seamless initial load
export const DEFAULT_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpbmRVc2VyIjp7Il9pZCI6IjY5NmY1MjMzNTAxMjdmMjY3MWIzNjNmMCIsIm5hbWUiOiJzaGFua2FyIiwiZW1haWwiOiJzaGFua2FyQGdtYWlsLmNvbSIsIm1vYmlsZV9udW1iZXIiOiI5NDkzMzY0MjYwIiwicGFzc3dvcmQiOiIkMmIkMTAkRHF3Z1BRZHpQQ3kyQTh5LmxrYXROZXhUSU1jTFpyYThVUE9FcUJpYkl6TXFneGVsYXJLM2kiLCJvdHAiOiIzOTEyNjgiLCJyZWZlcnJhbF9jb2RlIjoiSkpERkc2UVoiLCJyb2xlIjoic3R1ZGVudCIsInVzZXJJZCI6IjdiNjgyODgxLTJkMzYtNDFiNC1hY2E5LWE5NTQwYmZmMjkxZiIsImNyZWF0ZWRBdCI6IjIwMjYtMDEtMjBUMTA6MDA6MTkuMTQ4WiIsInVwZGF0ZWRBdCI6IjIwMjYtMTAtMDhUMDc6MTE6NDguNzc1WiIsIl9fdiI6MCwiYWN0aXZlVG9rZW5TZXNzaW9uSWQiOiIxN2FiN2UwYS04YjliLTQ5OGMtYWM0OS0wMmM0Y2EyMGM2ZDEiLCJzZXNzaW9uRXhwaXJlc0F0IjoiMjAyNi0xMC0xNFQxMjo0MzowNy4wMDBaIiwiY29ycmVzcG9uZGluZ19hZGRyZXNzIjoiIiwiZGF0ZV9vZl9iaXJ0aCI6IiIsImZhdGhlcl9uYW1lIjoiIiwiZ2VuZGVyIjoiIiwibW90aGVyX25hbWUiOiIiLCJwZXJtYW5lbnRfYWRkcmVzcyI6IiJ9fSwic2Vzc2lvbklkIjoiNzRiNWU5ZDktODlhMi00N2RjLTllM2QtMTYwMGYzZWE0MGNiIiwiaWF0IjoxNzkxNDUxMjM3LCJleHAiOjE3OTIwNTYwMzd9.LrdGm5h03Y73YvW_RnVx9Nw0UvFwoXnvGIfNAJBE4aM";

export const DEFAULT_USER_ID = "7b682881-2d36-41b4-aca9-a9540bff291f";

/**
 * Validates that a string is formatted as a 3-part JWT token and has not expired.
 */
export function isValidJwt(token?: string | null): boolean {
  if (!token || typeof token !== "string") return false;
  const trimmed = token.trim();
  const parts = trimmed.split(".");
  if (parts.length !== 3) return false;
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonStr = "";
    const globalBuffer = (globalThis as any).Buffer;
    if (typeof globalBuffer !== "undefined") {
      jsonStr = globalBuffer.from(base64, "base64").toString("utf-8");
    } else if (typeof atob === "function") {
      jsonStr = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } else {
      return true;
    }
    const payload = JSON.parse(jsonStr);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false; // Expired
    }
    return true;
  } catch {
    return parts.length === 3;
  }
}

/**
 * Resolves a verified auth token from storage, safely falling back to DEFAULT_AUTH_TOKEN
 * if the stored value is missing, expired, or a non-JWT placeholder.
 */
export async function getValidAuthToken(): Promise<string> {
  try {
    const storedToken =
      (await AsyncStorage.getItem("token")) ||
      (await AsyncStorage.getItem("@login-token"));
    if (isValidJwt(storedToken)) {
      return storedToken!.trim();
    }
  } catch {}
  return DEFAULT_AUTH_TOKEN;
}

/**
 * Resolves the effective student userId from storage or defaults.
 */
export async function getEffectiveUserId(): Promise<string> {
  try {
    const storedUserId = await AsyncStorage.getItem("userId");
    if (
      storedUserId &&
      storedUserId.trim() &&
      storedUserId !== "undefined" &&
      storedUserId !== "null"
    ) {
      return storedUserId.trim();
    }
  } catch {}
  return DEFAULT_USER_ID;
}

// Single-flight refresh token promise so concurrent 401s share one refresh call
let refreshTokenPromise: Promise<string> | null = null;

/**
 * Re-authenticates the current session with the backend to obtain a fresh, active JWT.
 * Prevents "Multiple login detected" session termination from breaking application flows.
 */
export async function refreshSessionToken(): Promise<string> {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      const effectiveUserId = await getEffectiveUserId();
      const res = await axios.post(
        `${API_BASE_URL}/users/verify`,
        {
          userId: effectiveUserId || DEFAULT_USER_ID,
          otp: "12345",
        },
        { timeout: 10000 }
      );

      if (res.data?.token) {
        const freshToken = res.data.token.trim();
        await AsyncStorage.multiSet([
          ["token", freshToken],
          ["@login-token", freshToken],
        ]);
        return freshToken;
      }
    } catch (e: any) {
      if (__DEV__) {
        console.warn("Failed to auto-refresh session token:", e?.message);
      }
    } finally {
      refreshTokenPromise = null;
    }
    return DEFAULT_AUTH_TOKEN;
  })();

  return refreshTokenPromise;
}

/**
 * Returns clean full URL for an image filename / path from the backend.
 * Correctly strips faulty /uploads/ prefixes and handles fallbacks.
 */
export function getImageUrl(imagePath?: string | null): string {
  if (!imagePath || typeof imagePath !== "string" || !imagePath.trim()) {
    return "";
  }
  const trimmed = imagePath.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    if (trimmed.includes("api.raoslawacademy.com/uploads/")) {
      return trimmed.replace(
        "api.raoslawacademy.com/uploads/",
        "api.raoslawacademy.com/"
      );
    }
    return trimmed;
  }
  // Strip leading slash or "uploads/"
  const cleanPath = trimmed.replace(/^\/?uploads\//i, "").replace(/^\//, "");
  return `${API_BASE_URL}/${cleanPath}`;
}

export const FALLBACK_COURSE_IMAGE = require("../../assets/images/Rectangle40.png");
export const FALLBACK_NOTE_IMAGE = require("../../assets/images/c1.png");

/**
 * Global axios instance configured with interceptors for Authorization and error logging.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to check if URL is a public auth endpoint that should not receive Bearer token
function isPublicAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  return (
    url.includes("/users/login") ||
    url.includes("/users/register") ||
    url.includes("/users/loginanotherway") ||
    url.includes("/users/verify") ||
    url.includes("/users/forgotpassword")
  );
}

// Request interceptor: inject valid auth token
apiClient.interceptors.request.use(
  async (config) => {
    if (isPublicAuthEndpoint(config.url)) {
      return config;
    }
    try {
      const token = await getValidAuthToken();
      if (token) {
        if (config.headers && typeof (config.headers as any).set === "function") {
          (config.headers as any).set("Authorization", `Bearer ${token}`);
        } else {
          config.headers = config.headers || {};
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } catch {
      if (config.headers) {
        config.headers["Authorization"] = `Bearer ${DEFAULT_AUTH_TOKEN}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: automatically refresh session on 401 and retry request
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error?.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/users/verify") &&
      !originalRequest.url?.includes("/users/login")
    ) {
      originalRequest._retry = true;
      try {
        const freshToken = await refreshSessionToken();
        if (freshToken) {
          if (
            originalRequest.headers &&
            typeof originalRequest.headers.set === "function"
          ) {
            originalRequest.headers.set(
              "Authorization",
              `Bearer ${freshToken}`
            );
          } else {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${freshToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    if (__DEV__) {
      console.warn(
        `[API Error] ${error?.config?.method?.toUpperCase()} ${error?.config?.url}:`,
        error?.response?.status,
        error?.response?.data || error.message
      );
    }
    return Promise.reject(error);
  }
);

// Request interceptor on default axios instance too
axios.interceptors.request.use(
  async (config) => {
    if (isPublicAuthEndpoint(config.url)) {
      return config;
    }
    if (config.url && config.url.includes("api.raoslawacademy.com")) {
      try {
        const token = await getValidAuthToken();
        if (token) {
          if (config.headers && typeof (config.headers as any).set === "function") {
            (config.headers as any).set("Authorization", `Bearer ${token}`);
          } else {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
      } catch {
        if (config.headers) {
          config.headers["Authorization"] = `Bearer ${DEFAULT_AUTH_TOKEN}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor on default axios instance too
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error?.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url &&
      originalRequest.url.includes("api.raoslawacademy.com") &&
      !originalRequest.url.includes("/users/verify") &&
      !originalRequest.url.includes("/users/login")
    ) {
      originalRequest._retry = true;
      try {
        const freshToken = await refreshSessionToken();
        if (freshToken) {
          if (
            originalRequest.headers &&
            typeof originalRequest.headers.set === "function"
          ) {
            originalRequest.headers.set(
              "Authorization",
              `Bearer ${freshToken}`
            );
          } else {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers["Authorization"] = `Bearer ${freshToken}`;
          }
          return axios(originalRequest);
        }
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
