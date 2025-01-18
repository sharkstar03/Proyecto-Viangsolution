import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Cotizaciones from "../pages/Cotizaciones";
import Facturas from "../pages/Facturas";
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/cotizaciones" element={<Cotizaciones />} />
      <Route path="/facturas" element={<Facturas />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
