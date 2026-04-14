import axios from 'axios';

/**
 * Configured Axios instance for VagaSolar API.
 *
 * - baseURL: reads from REACT_APP_API_URL env var
 *   → Dev:  http://localhost:5000
 *   → Prod: https://vagasolar-api.onrender.com
 *
 * - withCredentials: true is REQUIRED so the browser sends
 *   the httpOnly JWT cookie on every cross-domain request
 *   (Netlify frontend ↔ Render backend).
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 seconds
});

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Silently redirect to login if session expires
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      if (isAdminRoute) window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ─── Convenience wrappers ─────────────────────────────────────────────────────
export const apiGet    = (url, params) => api.get(url, { params });
export const apiPost   = (url, data)   => api.post(url, data);
export const apiPut    = (url, data)   => api.put(url, data);
export const apiPatch  = (url, data)   => api.patch(url, data);
export const apiDelete = (url)         => api.delete(url);

export default api;
