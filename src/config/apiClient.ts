import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  timeout: 10000,
});

// Store active requests by URL
const activeRequests = new Map<string, AbortController>();

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  if (config.url) {
    // Cancel previous request to the same URL
    if (activeRequests.has(config.url)) {
      activeRequests.get(config.url)?.abort();
    }

    const controller = new AbortController();
    config.signal = controller.signal;
    activeRequests.set(config.url, controller);
  }
  return config;
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (response.config.url) {
      activeRequests.delete(response.config.url);
    }
    return response;
  },
  (error) => {
    if (error.config?.url) {
      activeRequests.delete(error.config.url);
    }
    if (axios.isCancel(error)) {
      console.warn("Request canceled:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
