import { api } from "../api/client";

export const postService = {
  list: (params) => api.get("/posts", { params }).then((res) => res.data),
  featured: () => api.get("/posts/featured", { params: { limit: 8 } }).then((res) => res.data),
  trending: () => api.get("/posts/trending", { params: { limit: 8 } }).then((res) => res.data),
  bySlug: (slug) => api.get(`/posts/${slug}`).then((res) => res.data.data),
  create: (payload) => api.post("/posts", payload).then((res) => res.data.data),
  update: (id, payload) => api.patch(`/posts/${id}`, payload).then((res) => res.data.data),
  like: (id) => api.post(`/posts/${id}/like`).then((res) => res.data),
  bookmark: (id) => api.post(`/posts/${id}/bookmark`).then((res) => res.data),
  comments: (postId) => api.get(`/posts/${postId}/comments`).then((res) => res.data.data),
  addComment: (postId, payload) => api.post(`/posts/${postId}/comments`, payload).then((res) => res.data.data),
  delete: (id) => api.delete(`/posts/${id}`).then((res) => res.data),
  deleteComment: (id) => api.delete(`/comments/${id}`).then((res) => res.data),
  updateComment: (id, payload) => api.patch(`/comments/${id}`, payload).then((res) => res.data.data),
  uploadImage: (formData) => api.post("/posts/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then((res) => res.data)
};

