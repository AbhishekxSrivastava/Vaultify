import axios from "axios";

const Url = "http://192.168.137.1:8000/api" || "http://localhost:8000/api";

const API = axios.create({
  baseURL: Url,
  withCredentials: true, // Important for sending cookies
});

// Request Interceptor: Add the access token to every request
API.interceptors.request.use((req) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }
  return req;
});

// Response Interceptor: Handle token expiration and refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await API.post("/auth/refresh");
        localStorage.setItem("accessToken", data.accessToken);
        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        // On refresh error, logout the user
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // Force redirect
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
