import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true
});

// Interceptor pour ajouter token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor pour gérer les erreurs
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;