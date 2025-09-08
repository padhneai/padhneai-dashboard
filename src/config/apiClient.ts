import axios from "axios";

// Create reusable Axios client
const  apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-production-f97b.up.railway.app/api",
  timeout: 10000,
});
  // || "https://backend-production-f97b.up.railway.app/api",
// Track active requests for cancellation
const activeRequests = new Map<string, AbortController>();

// Cancel duplicate requests
apiClient.interceptors.request.use((config) => {
  if (config.url) {
    if (activeRequests.has(config.url)) {
      activeRequests.get(config.url)?.abort();
    }
    const controller = new AbortController();
    config.signal = controller.signal;
    activeRequests.set(config.url, controller);
  }
  return config;
});

// Remove from activeRequests after response
apiClient.interceptors.response.use(
  (response) => {
    if (response.config.url) activeRequests.delete(response.config.url);
    return response;
  },
  (error) => {
    if (error.config?.url) activeRequests.delete(error.config.url);
    if (axios.isCancel(error)) console.warn("Request canceled:", error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
