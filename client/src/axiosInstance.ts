import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";

// Define custom config type that includes retry
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  retry?: number;
}

const TIMEOUT = 60000; // 30 seconds

// Create base axios instance with dynamic baseURL
const isDevelopment = window.location.hostname === 'localhost';
const baseURL = isDevelopment 
  ? "http://localhost:4000" 
  : (window as any).env?.REACT_APP_API_URL || "https://jobboard-api.onrender.com"; // Replace with your actual Render URL

console.log('🔗 API Configuration:', {
  isDevelopment,
  baseURL,
  hostname: window.location.hostname
});

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true
});

// Configure retry behavior without using axios-retry
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const config = error.config as CustomInternalAxiosRequestConfig;
    
    // Only retry on 5xx errors or network errors, not timeouts or CORS errors
    if (
      !config || 
      !config.retry || 
      config.retry >= 3 ||
      error.code === 'ECONNABORTED' || 
      error.code === 'ERR_NETWORK' ||
      (error.response && error.response.status < 500)
    ) {
      // Format error message for common errors
      if (error.code === 'ERR_NETWORK') {
        error.response = {
          status: 0,
          data: {
            message: 'Network error. Please check your connection and try again.'
          }
        };
      }
      return Promise.reject(error);
    }

    // Increment retry count
    config.retry = (config.retry || 0) + 1;
    
    // Exponential backoff delay
    const delay = Math.min(1000 * (Math.pow(2, config.retry) - 1), 10000);
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry the request
    return axiosInstance(config);
  }
);

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const customConfig = config as CustomInternalAxiosRequestConfig;
    customConfig.timeout = TIMEOUT;
    customConfig.retry = 0;
    
    // Ensure withCredentials is set for all requests to send httpOnly cookies
    customConfig.withCredentials = true;
    
    // No need to manually set Authorization header - cookies are sent automatically
    
    // Don't set Content-Type for FormData
    if (!(config.data instanceof FormData)) {
      customConfig.headers.set('Content-Type', 'application/json');
    }
    
    return customConfig;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Log the error for debugging
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout,
        retry: (error.config as CustomInternalAxiosRequestConfig)?.retry,
        withCredentials: error.config?.withCredentials
      }
    });

    // Enhance error messages for common errors
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      error.response = {
        status: 408,
        data: {
          message: `The request timed out after ${TIMEOUT/1000} seconds. The server might be experiencing high load.`
        }
      };
    } else if (error.code === 'ERR_NETWORK') {
      error.response = {
        status: 0,
        data: {
          message: 'Unable to connect to the server. Please check your connection.'
        }
      };
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
