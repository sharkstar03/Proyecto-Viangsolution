import axiosInstance from "./api";

// Obtener todas las cotizaciones con paginación y filtros
export const obtenerCotizaciones = async (page = 1, limit = 10, client = "") => {
  try {
    const response = await axiosInstance.get("/cotizaciones", {
      params: { page, limit, client },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Crear una nueva cotización
export const crearCotizacion = async (cotizacion) => {
  try {
    const response = await axiosInstance.post("/cotizaciones", cotizacion);
    return response.data;
  } catch (error) {
    console.error("Error al crear cotización:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Eliminar una cotización por su ID
export const eliminarCotizacion = async (id) => {
  try {
    const response = await axiosInstance.delete(`/cotizaciones/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar cotización:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Generar un PDF para una cotización específica
export const generarPDF = async (cotizacionId) => {
  try {
    const response = await axiosInstance.get(`/cotizaciones/${cotizacionId}/pdf`, {
      responseType: "blob", // Para manejar archivos binarios
    });

    // Descarga automática del PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `cotizacion_${cotizacionId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return response.data;
  } catch (error) {
    console.error("Error al generar PDF:", error.response?.data?.message || error.message);
    throw error;
  }
};
