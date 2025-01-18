import axiosInstance from "./api";

// Obtener estadísticas generales
export const obtenerEstadisticas = async () => {
  try {
    const response = await axiosInstance.get("/estadisticas");
    return response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Obtener estadísticas específicas por tipo
export const obtenerEstadisticaPorTipo = async (tipo) => {
  try {
    const response = await axiosInstance.get(`/estadisticas/${tipo}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener estadísticas del tipo ${tipo}:`,
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

// Exporta todas las funciones para facilitar su uso
export default {
  obtenerEstadisticas,
  obtenerEstadisticaPorTipo,
};
