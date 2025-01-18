import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Importa el componente principal
import "./tailwind.css"; // Importa los estilos base de TailwindCSS

// Renderiza la aplicación en el DOM
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
