import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import FactualItem from "../components/shared/FactualItem";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import Modal from "../components/shared/Modal";
import axios from "axios";

const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);

  useEffect(() => {
    // Simula la carga de facturas desde la API
    const fetchFacturas = async () => {
      try {
        const response = await axios.get("/api/facturas"); // Ajusta según tu backend
        setFacturas(response.data);
      } catch (error) {
        console.error("Error al cargar las facturas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  const handleViewFactura = (id) => {
    const factura = facturas.find((item) => item.id === id);
    setSelectedFactura(factura);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFactura(null);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Encabezado */}
      <Header title="Facturas" />

      {/* Contenido */}
      <div className="flex-1 bg-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-6">Lista de Facturas</h2>

        {/* Lista de facturas */}
        {isLoading ? (
          <LoadingSpinner size="12" color="blue-500" />
        ) : facturas.length > 0 ? (
          <div className="space-y-4">
            {facturas.map((factura) => (
              <FactualItem
                key={factura.id}
                title={`Factura #${factura.id}`}
                subtitle={`Cliente: ${factura.cliente}`}
                amount={factura.total}
                date={factura.fecha}
                onClick={() => handleViewFactura(factura.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No hay facturas disponibles.</p>
        )}
      </div>

      {/* Modal para ver detalles */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Detalles de Factura">
        {selectedFactura ? (
          <div>
            <p>
              <strong>Cliente:</strong> {selectedFactura.cliente}
            </p>
            <p>
              <strong>Total:</strong> ${selectedFactura.total}
            </p>
            <p>
              <strong>Fecha:</strong> {selectedFactura.fecha}
            </p>
          </div>
        ) : (
          <p>Cargando...</p>
        )}
      </Modal>
    </div>
  );
};

export default Facturas;
