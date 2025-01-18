import axios from "axios";

const API_URL = "http://localhost:5000/api/facturas";

export const obtenerFacturas = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const crearFactura = async (factura) => {
  const response = await axios.post(API_URL, factura);
  return response.data;
};

export const eliminarFactura = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
