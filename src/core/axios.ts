import axios from 'axios';
import { handleApiError } from './errorHandler';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ── Request interceptor: inject auth token ──────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const platformToken = localStorage.getItem('matajer_token');
    const vendorToken = localStorage.getItem('matajer_vendor_token');

    // Use vendor token and Vendor header for vendor or store-scoped actions
    if (config.url?.startsWith('/vendor') || config.url?.startsWith('/notifications')) {
      if (vendorToken) {
        config.headers.Authorization = `Bearer ${vendorToken}`;
      }
      
      // Inject Vendor header automatically from persistent store
      try {
        const vendorState = localStorage.getItem('matajer-vendor-auth');
        if (vendorState) {
          const state = JSON.parse(vendorState).state;
          if (state && state.storeSlug) {
            // Only set if not already set manually (like in login)
            if (!config.headers.Vendor) {
              config.headers.Vendor = state.storeSlug;
            }
          }
        }
      } catch (err) {
        // Ignore parse errors
      }
    } else {
      if (platformToken) {
        config.headers.Authorization = `Bearer ${platformToken}`;
      }
    }

    // Fix: If we are sending FormData, remove the default application/json Content-Type
    // This allows Axios to automatically set multipart/form-data with the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: centralized error handling ────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);

export default api;
