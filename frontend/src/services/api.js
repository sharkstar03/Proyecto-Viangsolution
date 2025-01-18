const API_BASE_URL = "http://localhost:5000/api"; // Cambia esto según tu configuración

// Función para el inicio de sesión
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Función para registrar un nuevo usuario
export const register = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

// Función para obtener cotizaciones protegidas por JWT
export const getCotizaciones = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cotizaciones`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch cotizaciones");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching cotizaciones:", error);
    throw error;
  }
};

// Puedes agregar otras funciones para interactuar con tu API aquí

export default {
  login,
  register,
  getCotizaciones,
};
