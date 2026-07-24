import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bct_access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 && 
      !original._retry && 
      original.url && 
      !original.url.endsWith("/auth/refresh")
    ) {
      original._retry = true;
      const refreshToken = localStorage.getItem("bct_refresh_token");
      const refreshSecret = localStorage.getItem("bct_refresh_secret");
      if (refreshToken && refreshSecret) {
        try {
          const { data } = await api.post("/auth/refresh", { refreshToken, refreshSecret });
          localStorage.setItem("bct_access_token", data.accessToken);
          localStorage.setItem("bct_refresh_token", data.refreshToken);
          localStorage.setItem("bct_refresh_secret", data.refreshSecret);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch (refreshError) {
          // If the refresh token is expired or invalid, clear all tokens
          localStorage.removeItem("bct_access_token");
          localStorage.removeItem("bct_refresh_token");
          localStorage.removeItem("bct_refresh_secret");
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);
