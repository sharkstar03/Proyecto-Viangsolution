import axiosInstance from "./api";

// Función para iniciar sesión
export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post("/login", { username, password });
    const { token } = response.data;

    // Guarda el token en localStorage
    localStorage.setItem("token", token);

    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Función para registrar un nuevo usuario
export const register = async (username, password) => {
  try {
    const response = await axiosInstance.post("/register", { username, password });
    return response.data;
  } catch (error) {
    console.error("Error al registrar usuario:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Función para cerrar sesión
export const logout = () => {
  // Elimina el token del almacenamiento local
  localStorage.removeItem("token");
  window.location.href = "/login"; // Redirige al login
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Devuelve true si hay un token
};

// Función para obtener información del usuario autenticado
export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get("/me"); // Ruta para obtener información del usuario actual
    return response.data;
  } catch (error) {
    console.error("Error al obtener información del usuario:", error.message);
    throw error;
  }
};

export default {
  login,
  register,
  logout,
  isAuthenticated,
  getUserInfo,
};
