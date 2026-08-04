import axios, { type AxiosInstance, AxiosError } from "axios";
import { loadToken } from "../utils/token";
import { API_URL } from "../config";

// ─── Typed API error ──────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
// ─── Axios instance ───────────────────────────────────────────────────────────
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,

  // All requests send / accept JSON
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // Abort requests that take longer than 10 seconds
  timeout: 10_000,

  // Do NOT follow redirects automatically (let the app decide)
  maxRedirects: 0,
});

// ─── Request interceptor — attach Bearer token when present ──────────────────
axiosInstance.interceptors.request.use((config) => {
  const token = loadToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — normalise errors into ApiError ───────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string }>) => {
    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.error ?? error.message ?? "Request failed";
    return Promise.reject(new ApiError(message, status));
  },
);

// ─── Thin typed wrapper used by auth.ts / user.ts ────────────────────────────
export async function apiRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    params?: Record<string, string | number>;
  } = {},
): Promise<T> {
  const { data } = await axiosInstance.request<T>({
    url: path,
    method: options.method ?? "GET",
    data: options.body,
    params: options.params,
  });
  return data;
}
