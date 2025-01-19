// src/utils/validators.js

// Validar email
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  // Validar contraseña (mínimo 8 caracteres, una mayúscula, una minúscula y un número)
  export const isValidPassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  };
  
  // Validar RFC (México)
  export const isValidRFC = (rfc) => {
    const re = /^([A-ZÑ&]{3,4})(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))([A-Z\d]{2})([A\d])$/;
    return re.test(rfc);
  };
  
  // Validar teléfono (10 dígitos)
  export const isValidPhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };
  
  // Validar que un valor no esté vacío
  export const isNotEmpty = (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  };
  
  // Validar número positivo
  export const isPositiveNumber = (value) => {
    return typeof value === 'number' && value > 0;
  };
  
  // Validar que el valor esté dentro de un rango
  export const isInRange = (value, min, max) => {
    return value >= min && value <= max;
  };
  
  // Validar fecha
  export const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
  };
  
  // Validar si dos contraseñas coinciden
  export const doPasswordsMatch = (password, confirmPassword) => {
    return password === confirmPassword;
  };
  
  // Validar longitud máxima
  export const isValidLength = (value, maxLength) => {
    return value.length <= maxLength;
  };
  
  // Validar formato de moneda
  export const isValidCurrency = (value) => {
    return /^\d+(\.\d{1,2})?$/.test(value);
  };