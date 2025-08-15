import axios from "axios";

const baseURL = "https://vaultify-sjl2.onrender.com/api";

const API = axios.create({
  baseURL: baseURL,
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

// --- NEW, ROBUST REFRESH LOGIC ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle token expiration and refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 error and ensure it's not a retry request or the refresh token request itself
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we are already refreshing, queue this request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return API(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        API.post("/auth/refresh")
          .then(({ data }) => {
            localStorage.setItem("accessToken", data.accessToken);
            API.defaults.headers.common["Authorization"] =
              "Bearer " + data.accessToken;
            originalRequest.headers["Authorization"] =
              "Bearer " + data.accessToken;
            processQueue(null, data.accessToken);
            resolve(API(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            // On refresh error, logout the user
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            window.location.href = "/login"; // Force redirect
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(error);
  }
);

export default API;
