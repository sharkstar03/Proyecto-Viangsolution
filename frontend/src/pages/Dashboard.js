import React from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDollarSign, 
  faCheck, 
  faTimes, 
  faClock,
  faFileAlt 
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/layout/Sidebar';

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
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <FontAwesomeIcon icon={faDollarSign} className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-sm mb-1">Ventas Totales</h3>
            <div className="text-2xl font-bold mb-1">$612,917</div>
          </div>

          <div className="bg-green-100 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-200 rounded-lg">
                <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-700" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Cotizaciones Aprobadas</h3>
            <div className="text-2xl font-bold mb-1 text-green-700">89</div>
          </div>

          <div className="bg-red-100 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-200 rounded-lg">
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-red-700" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Cotizaciones Rechazadas</h3>
            <div className="text-2xl font-bold mb-1 text-red-700">23</div>
          </div>

          <div className="bg-orange-100 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-200 rounded-lg">
                <FontAwesomeIcon icon={faClock} className="h-5 w-5 text-orange-700"/>
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Cotizaciones Pendientes</h3>
            <div className="text-2xl font-bold mb-1 text-yellow-700">23</div>
          </div>

          <div className="bg-white p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <FontAwesomeIcon icon={faFileAlt} className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">Total de Facturas</h3>
            <div className="text-2xl font-bold mb-1">89</div>
          </div>
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
      </main>
    </div>
  );
};

export default Dashboard;