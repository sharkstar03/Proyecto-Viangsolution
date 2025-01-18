import axios from "axios";

// URL base de la API
const API_BASE_URL = "http://localhost:5000/api"; // Cambia esto según tu backend

// Configuración global de Axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Tiempo de espera máximo (10 segundos)
});

// Interceptor para agregar el token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtiene el token del almacenamiento local
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirige al login si la autenticación falla
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
