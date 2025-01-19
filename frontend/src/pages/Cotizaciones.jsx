// src/pages/Cotizaciones.jsx
import { Routes, Route } from 'react-router-dom';
import CotizacionList from '../components/cotizaciones/CotizacionList';
import CotizacionForm from '../components/cotizaciones/CotizacionForm';
import CotizacionDetail from '../components/cotizaciones/CotizacionDetail';

const Cotizaciones = () => {
  return (
    <Routes>
      <Route index element={<CotizacionList />} />
      <Route path="new" element={<CotizacionForm />} />
      <Route path=":id" element={<CotizacionDetail />} />
      <Route path=":id/edit" element={<CotizacionForm />} />
    </Routes>
  );
};

export default Cotizaciones;