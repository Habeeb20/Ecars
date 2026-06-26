// src/lib/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- Inventory (dealer-side) ----------
export const inventoryApi = {
  list: (params) => api.get('/inventory', { params }).then((r) => r.data),
  stats: () => api.get('/inventory/stats').then((r) => r.data.data),
  create: (payload) => api.post('/inventory', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/inventory/${id}`, payload).then((r) => r.data),
  markSold: (id, soldPrice) => api.patch(`/inventory/${id}/sold`, { soldPrice }).then((r) => r.data),
  remove: (id) => api.delete(`/inventory/${id}`).then((r) => r.data),
  bulkStatus: (ids, status) => api.patch('/inventory/bulk/status', { ids, status }).then((r) => r.data),
  bulkDelete: (ids) => api.delete('/inventory/bulk', { data: { ids } }).then((r) => r.data),
  getById: (id) => api.get(`/inventory/listing/${id}`).then((r) => r.data.data),
  getSimilar: (id) => api.get(`/inventory/listing/${id}/similar`).then((r) => r.data.data),
};

// ---------- Public dealer storefront ----------
export const dealerApi = {
  getBySlug: (slug, params = {}) =>
    api.get(`/dealers/${slug}`, { params }).then((r) => r.data.data),
  checkSlug: (slug) => api.get(`/dealers/check-slug/${slug}`).then((r) => r.data.exists),
};