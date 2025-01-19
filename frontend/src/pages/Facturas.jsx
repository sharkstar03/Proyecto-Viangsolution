// src/pages/Facturas.jsx
import { Routes, Route } from 'react-router-dom';
import FacturaList from '../components/facturas/FacturaList';
import FacturaForm from '../components/facturas/FacturaForm';
import FacturaDetail from '../components/facturas/FacturaDetail';

const Facturas = () => {
  return (
    <Routes>
      <Route index element={<FacturaList />} />
      <Route path="new" element={<FacturaForm />} />
      <Route path=":id" element={<FacturaDetail />} />
      <Route path=":id/edit" element={<FacturaForm />} />
    </Routes>
  );
};

export default Facturas;