// src/services/cotizacion.service.js
import { api } from './api'; 

export const cotizacionService = {
  // Obtener todas las cotizaciones
  getAll: async () => {
    try {
      return await api.get('/cotizaciones');
    } catch (error) {
      console.error('Error getting cotizaciones:', error);
      throw error;
    }
  },

  // Obtener una cotización por ID
  getById: async (id) => {
    try {
      return await api.get(`/cotizaciones/${id}`);
    } catch (error) {
      console.error('Error getting cotización:', error);
      throw error;
    }
  },

  // Crear una nueva cotización
  create: async (cotizacionData) => {
    try {
      return await api.post('/cotizaciones', cotizacionData);
    } catch (error) {
      console.error('Error creating cotización:', error);
      throw error;
    }
  },

  // Actualizar una cotización existente
  update: async (id, cotizacionData) => {
    try {
      return await api.put(`/cotizaciones/${id}`, cotizacionData);
    } catch (error) {
      console.error('Error updating cotización:', error);
      throw error;
    }
  },

  // Eliminar una cotización
  delete: async (id) => {
    try {
      return await api.delete(`/cotizaciones/${id}`);
    } catch (error) {
      console.error('Error deleting cotización:', error);
      throw error;
    }
  }
};