import axios from "axios";

// URL base de la API
const API_BASE_URL = "http://localhost:5000/api"; // Cambia esto según tu configuración

// Crear instancia de Axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Tiempo máximo de espera (10 segundos)
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Si la autenticación falla, redirige al login
        window.location.href = "/login";
      }
      console.error(
        "Error de respuesta:",
        error.response.data?.message || error.message
      );
    } else {
      console.error("Error de conexión:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
