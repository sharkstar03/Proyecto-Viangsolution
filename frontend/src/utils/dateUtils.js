import { format, parseISO, differenceInDays, addDays } from "date-fns";

// Formatear una fecha a un formato legible
export const formatearFecha = (fecha, formato = "dd/MM/yyyy") => {
  try {
    return format(new Date(fecha), formato);
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return fecha; // Devuelve la fecha original si ocurre un error
  }
};

// Calcular la diferencia en días entre dos fechas
export const diferenciaEnDias = (fechaInicio, fechaFin) => {
  try {
    return differenceInDays(new Date(fechaFin), new Date(fechaInicio));
  } catch (error) {
    console.error("Error al calcular diferencia en días:", error);
    return null;
  }
};

// Agregar días a una fecha
export const agregarDias = (fecha, dias) => {
  try {
    return addDays(new Date(fecha), dias);
  } catch (error) {
    console.error("Error al agregar días a la fecha:", error);
    return fecha;
  }
};

// Verificar si una fecha es válida
export const esFechaValida = (fecha) => {
  try {
    return !isNaN(new Date(fecha).getTime());
  } catch (error) {
    console.error("Error al validar fecha:", error);
    return false;
  }
};

// Convertir una fecha en formato ISO a un formato legible
export const convertirFechaISO = (fechaISO, formato = "dd/MM/yyyy") => {
  try {
    return format(parseISO(fechaISO), formato);
  } catch (error) {
    console.error("Error al convertir fecha ISO:", error);
    return fechaISO;
  }
};
