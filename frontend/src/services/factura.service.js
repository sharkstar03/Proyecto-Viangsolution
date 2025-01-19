// src/services/factura.service.js
import { api } from './api';

export const facturaService = {
  // Obtener todas las facturas
  getAll: async () => {
    try {
      return await api.get('/facturas');
    } catch (error) {
      console.error('Error getting facturas:', error);
      throw error;
    }
  },

  // Obtener una factura por ID
  getById: async (id) => {
    try {
      return await api.get(`/facturas/${id}`);
    } catch (error) {
      console.error('Error getting factura:', error);
      throw error;
    }
  },

  // Crear una nueva factura
  create: async (facturaData) => {
    try {
      return await api.post('/facturas', facturaData);
    } catch (error) {
      console.error('Error creating factura:', error);
      throw error;
    }
  },

  // Actualizar una factura existente
  update: async (id, facturaData) => {
    try {
      return await api.put(`/facturas/${id}`, facturaData);
    } catch (error) {
      console.error('Error updating factura:', error);
      throw error;
    }
  },

  // Eliminar una factura
  delete: async (id) => {
    try {
      return await api.delete(`/facturas/${id}`);
    } catch (error) {
      console.error('Error deleting factura:', error);
      throw error;
    }
  },

  // Generar PDF de la factura
  generatePDF: async (id) => {
    try {
      return await api.get(`/facturas/${id}/pdf`);
    } catch (error) {
      console.error('Error generating factura PDF:', error);
      throw error;
    }
  },

  // Enviar factura por email
  sendByEmail: async (id, emailData) => {
    try {
      return await api.post(`/facturas/${id}/send-email`, emailData);
    } catch (error) {
      console.error('Error sending factura by email:', error);
      throw error;
    }
  }
};