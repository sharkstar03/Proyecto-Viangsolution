import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Facturas from "../pages/Facturas";
import Cotizaciones from "../pages/Cotizaciones";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/facturas" element={<Facturas />} />
        <Route path="/cotizaciones" element={<Cotizaciones />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
