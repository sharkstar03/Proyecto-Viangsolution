import axios from "axios";

const API_URL = "http://localhost:5000/api/cotizaciones";

export const obtenerCotizaciones = async (page = 1, limit = 10, client = '') => {
  const response = await axios.get(API_URL, {
    params: {
      page,
      limit,
      client
    }
  });
  return response.data;
};

export const crearCotizacion = async (cotizacion) => {
  const response = await axios.post(API_URL, cotizacion);
  return response.data;
};

export const eliminarCotizacion = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const generarPDF = async (cotizacionData) => {
  const response = await axios.post(
    "http://localhost:5000/api/generar-cotizacion",
    cotizacionData,
    {
      responseType: 'blob',
    }
  );
  return response.data;
};