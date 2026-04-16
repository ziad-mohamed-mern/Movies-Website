import axios from "axios";

const instance = axios.create({
  baseURL: "https://movies-website-production-fd3c.up.railway.app/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to ensure credentials are sent with every request
instance.interceptors.request.use(
  (config) => {
    // Ensure withCredentials is always true for all requests
    config.withCredentials = true;
    
    // Add Authorization header if token exists
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging
    console.log("Making request to:", config.url);
    console.log("With credentials:", config.withCredentials);
    console.log("Authorization header:", config.headers.Authorization ? "Present" : "Not present");
    console.log("Request headers:", config.headers);
    
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
instance.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.status, error.config?.url);
    console.error("Error details:", error.response?.data);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access - redirect to login or clear user state
      console.error("Unauthorized access - authentication required");
      console.error("Token in localStorage:", localStorage.getItem('token'));
      // Clear invalid token
      localStorage.removeItem('token');
      // You might want to dispatch a logout action here
    }
    return Promise.reject(error);
  }
);

export default instance;
