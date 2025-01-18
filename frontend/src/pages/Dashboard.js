// Importaciones necesarias
import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDollarSign, 
   
   
   
  faChartLine, 
  faFileInvoice, 
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import EstadisticasCard from '../components/widgets/EstadisticasCard';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula la carga de estadísticas desde una API
    const fetchEstadisticas = async () => {
      try {
        const data = {
          totalCotizaciones: 120,
          totalClientes: 45,
          ingresosTotales: 12345.67,
          nuevosClientes: 10,
        }; // Este sería el resultado de una llamada a la API
        setEstadisticas(data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  const lineChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Ganancias',
        data: [30000, 45000, 35000, 50000, 45000, 60000, 55000],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true
      }
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <Header title="Dashboard" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            <LoadingSpinner size="12" color="blue-500" />
          ) : (
            <>
              <EstadisticasCard
                icon={faFileInvoice}
                title="Total Cotizaciones"
                value={estadisticas.totalCotizaciones}
                color="blue-500"
              />
              <EstadisticasCard
                icon={faUsers}
                title="Clientes Totales"
                value={estadisticas.totalClientes}
                color="green-500"
              />
              <EstadisticasCard
                icon={faDollarSign}
                title="Ingresos Totales"
                value={`$${estadisticas.ingresosTotales.toLocaleString()}`}
                color="yellow-500"
              />
              <EstadisticasCard
                icon={faChartLine}
                title="Nuevos Clientes"
                value={estadisticas.nuevosClientes}
                color="purple-500"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-7 gap-6">
          <div className="col-span-4">
            <div className="bg-white p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-semibold mb-1">Hábitos de Ganancias</h3>
                  <p className="text-sm text-gray-500">Seguimiento de ganancias mensuales</p>
                </div>
                <button className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                  Este año
                  <span className="ml-2">▼</span>
                </button>
              </div>
              <div className="h-64">
                <Line data={lineChartData} options={lineOptions} />
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <div className="bg-white p-6 rounded-2xl mb-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-semibold mb-1">Estadísticas de Servicios</h3>
                  <p className="text-sm text-gray-500">Seguimiento de servicios solicitados</p>
                </div>
                <button className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                  Hoy
                  <span className="ml-2">▼</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faDollarSign} className="h-5 w-5 mr-3" />
                    <span>Pulimiento de Piso</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">2,487</span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">+1.8%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faDollarSign} className="h-5 w-5 mr-3" />
                    <span>Juegos</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">1,828</span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">+2.3%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faDollarSign} className="h-5 w-5 mr-3" />
                    <span>Muebles</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">1,463</span>
                    <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">-0.4%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-semibold mb-1">Ganancia por Distrito</h3>
                  <p className="text-sm text-gray-500">Distribución de Clientes</p>
                </div>
                <button className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                  Este mes
                  <span className="ml-2">▼</span>
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { province: "Panamá", count: 2417 },
                  { province: "Colón", count: 847 },
                  { province: "Chiriquí", count: 1281 },
                  { province: "Veraguas", count: 612 },
                  { province: "Coclé", count: 534 },
                  { province: "Herrera", count: 423 },
                  { province: "Los Santos", count: 389 },
                  { province: "Bocas del Toro", count: 312 },
                  { province: "Darién", count: 187 },
                  { province: "Panamá Oeste", count: 1543 }
                ].map(({ province, count }) => (
                  <div key={province} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faDollarSign} className="h-5 w-5 mr-3" />
                      <span>{province}</span>
                    </div>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

