// Validar un correo electrónico
export const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // Validar una contraseña (mínimo 8 caracteres, al menos una letra y un número)
  export const validarPassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };
  
  // Validar un número de teléfono (formato general)
  export const validarTelefono = (telefono) => {
    const regex = /^\+?\d{7,15}$/; // Soporta números con o sin código de país
    return regex.test(telefono);
  };
  
  // Validar un RUC (Panamá, formato genérico)
  export const validarRUC = (ruc) => {
    const regex = /^\d{8}-\d{1,4}-\d{1,2}$/;
    return regex.test(ruc);
  };
  
  // Verificar si un campo está vacío
  export const validarCampoVacio = (campo) => {
    return campo && campo.trim().length > 0;
  };
  
  // Validar si un número está dentro de un rango
  export const validarRango = (numero, min, max) => {
    return numero >= min && numero <= max;
  };
  
  // Validar una fecha
  export const validarFecha = (fecha) => {
    return !isNaN(new Date(fecha).getTime());
  };
  