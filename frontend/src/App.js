import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./tailwind.css"; // Importa estilos base de TailwindCSS

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
