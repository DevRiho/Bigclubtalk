import { api } from "../api/client";

export const metaService = {
  categories: () => api.get("/categories").then((res) => res.data.data),
  createCategory: (payload) => api.post("/categories", payload).then((res) => res.data.data),
  updateCategory: (id, payload) => api.patch(`/categories/${id}`, payload).then((res) => res.data.data),
  deleteCategory: (id) => api.delete(`/categories/${id}`).then((res) => res.data),
  authors: () => api.get("/authors").then((res) => res.data.data),
  newsletter: (email) => api.post("/newsletter/subscribe", { email }).then((res) => res.data),
  subscribers: () => api.get("/newsletter/subscribers").then((res) => res.data.data),
  analytics: () => api.get("/admin/analytics").then((res) => res.data.data),
  adminUsers: () => api.get("/admin/users").then((res) => res.data.data),
  updateAdminUser: (id, payload) => api.patch(`/admin/users/${id}`, payload).then((res) => res.data.data),
  adminPosts: () => api.get("/admin/posts").then((res) => res.data.data),
  adminComments: () => api.get("/admin/comments").then((res) => res.data.data)
};

