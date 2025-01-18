import axiosInstance from "./api";

// Obtener todas las facturas
export const obtenerFacturas = async (page = 1, limit = 10, cliente = "") => {
  try {
    const response = await axiosInstance.get("/facturas", {
      params: { page, limit, cliente },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener facturas:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Crear una nueva factura
export const crearFactura = async (factura) => {
  try {
    const response = await axiosInstance.post("/facturas", factura);
    return response.data;
  } catch (error) {
    console.error("Error al crear factura:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Eliminar una factura por ID
export const eliminarFactura = async (id) => {
  try {
    const response = await axiosInstance.delete(`/facturas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar factura:", error.response?.data?.message || error.message);
    throw error;
  }
};

// Generar PDF de una factura
export const generarFacturaPDF = async (facturaId) => {
  try {
    const response = await axiosInstance.get(`/facturas/${facturaId}/pdf`, {
      responseType: "blob", // Maneja archivos binarios
    });

    // Descarga automática del PDF
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `factura_${facturaId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return response.data;
  } catch (error) {
    console.error("Error al generar PDF de factura:", error.response?.data?.message || error.message);
    throw error;
  }
};

export default {
  obtenerFacturas,
  crearFactura,
  eliminarFactura,
  generarFacturaPDF,
};
