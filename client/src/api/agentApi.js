// api/agentApi.js
// Uses the same VITE_BACKEND_URL as your Login/Register pages and the JWT saved by AuthContext.
import axios from 'axios';

const BASE = import.meta.env.VITE_BACKEND_URL; // already includes your API prefix
const http = axios.create({ baseURL: BASE });

http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const get = (url, params) => http.get(url, { params }).then((r) => r.data);
const send = (method, url, body) => http[method](url, body).then((r) => r.data);

export const errMsg = (e) => e?.response?.data?.message || e?.message || 'Something went wrong';

export const agentApi = {
  overview: () => get('/agent/overview'),
  referrals: (params) => get('/agent/referrals', params),
  earnings: (params) => get('/agent/earnings', params),
  payouts: (params) => get('/agent/payouts', params),
  requestPayout: (body) => send('post', '/agent/payouts', body),
  registerUser: (body) => send('post', '/agent/users', body),
};

export const adminAgentApi = {
  overview: () => get('/admin/agent-network/overview'),
  agents: (params) => get('/admin/agent-network', params),
  agent: (id) => get(`/admin/agent-network/${id}`),
  payouts: (params) => get('/admin/agent-network/payouts', params),
  approve: (id) => send('patch', `/admin/agent-network/payouts/${id}/approve`),
  reject: (id, reason) => send('patch', `/admin/agent-network/payouts/${id}/reject`, { reason }),
  markPaid: (id, paymentReference) => send('patch', `/admin/agent-network/payouts/${id}/paid`, { paymentReference }),
};