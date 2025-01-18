import React, { useEffect, useState } from "react";
import axios from "axios";

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    const fetchFacturas = async () => {
      const response = await axios.get("http://localhost:5000/api/facturas");
      setFacturas(response.data);
    };
    fetchFacturas();
  }, []);

  return (
    <div>
      <h2>Facturas</h2>
      <ul>
        {facturas.map((factura) => (
          <li key={factura.id}>
            {factura.client} - ${factura.monto}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Facturas;
