import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faFileAlt, 
  faUsers, 
  faCog, 
  faComments, 
  faQuestionCircle, 
  faChartBar 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white p-6 flex flex-col shadow-lg h-screen">
      <div className="flex items-center mb-8">
        <img src="/viang-logo.png" alt="Viang Solution" className="h-12 w-auto mr-2" />
      </div>
      
      <div className="space-y-4 flex-1">
        <div className="text-sm text-gray-500 mb-2">MENÚ</div>
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-gray-700 hover:bg-gray-100 w-full p-2 rounded-lg transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faHome} className="mr-3 text-gray-500 h-5 w-5" />
            Panel Principal
          </button>
          
          <button 
            onClick={() => navigate('/cotizaciones')} 
            className="flex items-center text-gray-700 hover:bg-gray-100 w-full p-2 rounded-lg transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faFileAlt} className="mr-3 text-gray-500 h-5 w-5" />
            Cotizaciones
          </button>
          
          <button 
            onClick={() => navigate('/facturas')} 
            className="flex items-center text-gray-700 hover:bg-gray-100 w-full p-2 rounded-lg transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faFileAlt} className="mr-3 text-gray-500 h-5 w-5" />
            Facturas
          </button>
          
          <button 
            onClick={() => navigate('/clientes')} 
            className="flex items-center text-gray-700 hover:bg-gray-100 w-full p-2 rounded-lg transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faUsers} className="mr-3 text-gray-500 h-5 w-5" />
            Clientes
          </button>
        </div>

        <div className="text-sm text-gray-500 mt-8 mb-2">REPORTES</div>
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/reportes')} 
            className="flex items-center text-gray-700 hover:bg-gray-100 w-full p-2 rounded-lg transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faChartBar} className="mr-3 text-gray-500 h-5 w-5" />
            Reportes
          </button>
        </div>

        <div className="text-sm text-gray-500 mt-8 mb-2">HERRAMIENTAS</div>
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/configuracion')} 
            className="flex items-center text-gray-700 hover:bg-gray-100 w-full p-2 rounded-lg transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faCog} className="mr-3 text-gray-500 h-5 w-5" />
            Configuración
          </button>
          
          <button 
            onClick={() => navigate('/comentarios')} 
            className="flex items-center text-gray-700 hover:bg-gray-100 w-full p-2 rounded-lg transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faComments} className="mr-3 text-gray-500 h-5 w-5" />
            Comentarios
          </button>
          
          <button 
            onClick={() => navigate('/ayuda')} 
            className="flex items-center text-gray-700 hover:bg-gray-100 w-full p-2 rounded-lg transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faQuestionCircle} className="mr-3 text-gray-500 h-5 w-5" />
            Ayuda
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;