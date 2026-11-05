import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!import.meta.env.DEV && !configuredApiUrl) {
  throw new Error("VITE_API_URL must be set to the deployed backend URL.");
}

export const API_URL = (
  configuredApiUrl || "http://localhost:5000/api"
).replace(/\/+$/, "");
export const API_ORIGIN = API_URL.replace(/\/api$/i, "");
export const getProductImageUrl = (image) =>
  /^https?:\/\//i.test(image) ? image : `${API_ORIGIN}${image}`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;