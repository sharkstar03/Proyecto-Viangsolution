// src/utils/formatters.js

// Formatear moneda
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };
  
  // Formatear fecha
  export const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(date));
  };
  
  // Formatear fecha y hora
  export const formatDateTime = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };
  
  // Formatear número
  export const formatNumber = (number) => {
    return new Intl.NumberFormat('es-MX').format(number);
  };
  
  // Formatear porcentaje
  export const formatPercentage = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };
  
  // Formatear RFC
  export const formatRFC = (rfc) => {
    if (!rfc) return '';
    return rfc.toUpperCase();
  };
  
  // Formatear teléfono
  export const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
  };