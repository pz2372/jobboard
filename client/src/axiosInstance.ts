import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor (e.g., for adding auth tokens)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor (optional for handling errors globally)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
