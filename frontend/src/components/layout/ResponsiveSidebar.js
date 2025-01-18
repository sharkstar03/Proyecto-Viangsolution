import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faFileAlt,
  faUsers,
  faCog,
  faComments,
  faQuestionCircle,
  faChartBar,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

const ResponsiveSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Función para verificar si una ruta está activa
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen">
      {/* Botón para abrir/cerrar la barra lateral en dispositivos móviles */}
      <button
        className="p-4 text-gray-600 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white shadow-lg p-6 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:w-64`}
      >
        <div className="flex items-center mb-8">
          <img src="/viang-logo.png" alt="Viang Solution" className="h-12 w-auto mr-2" />
        </div>

        <div className="space-y-4 flex-1">
          <div className="text-sm text-gray-500 mb-2">MENÚ</div>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/")}
              className={`flex items-center text-gray-700 w-full p-2 rounded-lg transition-colors duration-200 ${
                isActive("/") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={faHome} className="mr-3 text-gray-500 h-5 w-5" />
              Panel Principal
            </button>

            <button
              onClick={() => navigate("/cotizaciones")}
              className={`flex items-center text-gray-700 w-full p-2 rounded-lg transition-colors duration-200 ${
                isActive("/cotizaciones") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={faFileAlt} className="mr-3 text-gray-500 h-5 w-5" />
              Cotizaciones
            </button>

            <button
              onClick={() => navigate("/facturas")}
              className={`flex items-center text-gray-700 w-full p-2 rounded-lg transition-colors duration-200 ${
                isActive("/facturas") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={faFileAlt} className="mr-3 text-gray-500 h-5 w-5" />
              Facturas
            </button>

            <button
              onClick={() => navigate("/clientes")}
              className={`flex items-center text-gray-700 w-full p-2 rounded-lg transition-colors duration-200 ${
                isActive("/clientes") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={faUsers} className="mr-3 text-gray-500 h-5 w-5" />
              Clientes
            </button>
          </div>

          <div className="text-sm text-gray-500 mt-8 mb-2">REPORTES</div>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/reportes")}
              className={`flex items-center text-gray-700 w-full p-2 rounded-lg transition-colors duration-200 ${
                isActive("/reportes") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={faChartBar} className="mr-3 text-gray-500 h-5 w-5" />
              Reportes
            </button>
          </div>

          <div className="text-sm text-gray-500 mt-8 mb-2">HERRAMIENTAS</div>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/configuracion")}
              className={`flex items-center text-gray-700 w-full p-2 rounded-lg transition-colors duration-200 ${
                isActive("/configuracion") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={faCog} className="mr-3 text-gray-500 h-5 w-5" />
              Configuración
            </button>

            <button
              onClick={() => navigate("/comentarios")}
              className={`flex items-center text-gray-700 w-full p-2 rounded-lg transition-colors duration-200 ${
                isActive("/comentarios") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={faComments} className="mr-3 text-gray-500 h-5 w-5" />
              Comentarios
            </button>

            <button
              onClick={() => navigate("/ayuda")}
              className={`flex items-center text-gray-700 w-full p-2 rounded-lg transition-colors duration-200 ${
                isActive("/ayuda") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="mr-3 text-gray-500 h-5 w-5" />
              Ayuda
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 ml-0 md:ml-64 bg-gray-100">
        {/* Aquí iría el contenido dinámico de las páginas */}
      </div>
    </div>
  );
};

export default ResponsiveSidebar;
