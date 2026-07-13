import { api } from "../api/client";

function persistTokens(data) {
  localStorage.setItem("bct_access_token", data.accessToken);
  localStorage.setItem("bct_refresh_token", data.refreshToken);
  localStorage.setItem("bct_refresh_secret", data.refreshSecret);
}

export const authService = {
  login: async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    persistTokens(data);
    return data.user;
  },
  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistTokens(data);
    return data.user;
  },
  socialLogin: async (payload) => {
    const { data } = await api.post("/auth/social", payload);
    persistTokens(data);
    return data.user;
  },
  me: () => api.get("/auth/me").then((res) => res.data.user),
  verifyEmail: (payload) => api.post("/auth/verify-email", payload).then((res) => res.data),
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload).then((res) => res.data),
  resetPassword: (payload) => api.post("/auth/reset-password", payload).then((res) => res.data),
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("bct_access_token");
      localStorage.removeItem("bct_refresh_token");
      localStorage.removeItem("bct_refresh_secret");
    }
  }
};

