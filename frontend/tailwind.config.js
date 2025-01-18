/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Escanea estos archivos para detectar clases de Tailwind
    "./public/index.html",        // Incluye el HTML si lo utilizas
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Azul personalizado
        secondary: "#64748B", // Gris personalizado
      },
    },
  },
  plugins: [],
};
