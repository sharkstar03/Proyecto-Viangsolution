import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/layout/Header";
import EstadisticasCard from "../components/widgets/EstadisticasCard";
import FactualItem from "../components/shared/FactualItem";
import Modal from "../components/shared/Modal";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";

const Cotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCotizacion, setSelectedCotizacion] = useState(null);

  useEffect(() => {
    // Simula la carga de datos desde la API
    const fetchCotizaciones = async () => {
      try {
        const response = await axios.get("/api/cotizaciones"); // Ajusta según tu backend
        setCotizaciones(response.data);
      } catch (error) {
        console.error("Error al cargar las cotizaciones:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCotizaciones();
  }, []);

  const handleViewCotizacion = (id) => {
    const cotizacion = cotizaciones.find((item) => item.id === id);
    setSelectedCotizacion(cotizacion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCotizacion(null);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Encabezado */}
      <Header title="Cotizaciones" />

      {/* Contenido */}
      <div className="flex-1 bg-gray-100 p-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <EstadisticasCard
            icon={faFileInvoice}
            title="Total Cotizaciones"
            value={cotizaciones.length}
            color="blue-500"
          />
        </div>

        {/* Lista de cotizaciones */}
        {isLoading ? (
          <LoadingSpinner size="12" color="blue-500" />
        ) : cotizaciones.length > 0 ? (
          <div className="space-y-4">
            {cotizaciones.map((cotizacion) => (
              <FactualItem
                key={cotizacion.id}
                title={`Cotización #${cotizacion.id}`}
                subtitle={`Cliente: ${cotizacion.cliente}`}
                amount={cotizacion.total}
                date={cotizacion.fecha}
                onClick={() => handleViewCotizacion(cotizacion.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No hay cotizaciones disponibles.</p>
        )}
      </div>

      {/* Modal para ver detalles */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Detalles de Cotización">
        {selectedCotizacion ? (
          <div>
            <p>
              <strong>Cliente:</strong> {selectedCotizacion.cliente}
            </p>
            <p>
              <strong>Total:</strong> ${selectedCotizacion.total}
            </p>
            <p>
              <strong>Fecha:</strong> {selectedCotizacion.fecha}
            </p>
          </div>
        ) : (
          <p>Cargando...</p>
        )}
      </Modal>
    </div>
  );
};

export default Cotizaciones;
