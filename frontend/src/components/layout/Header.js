import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Header = ({ title, onLogout }) => {
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      {/* Título de la página */}
      <h1 className="text-xl font-bold text-gray-800">{title || "Viang Solution"}</h1>

      {/* Acciones globales */}
      <div className="flex items-center space-x-6">
        {/* Notificaciones */}
        <button
          className="relative text-gray-600 hover:text-gray-800 focus:outline-none"
          title="Notificaciones"
        >
          <FontAwesomeIcon icon={faBell} size="lg" />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            3
          </span>
        </button>

        {/* Perfil de usuario */}
        <div className="flex items-center space-x-4">
          <FontAwesomeIcon
            icon={faUserCircle}
            size="2x"
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          />
          <div>
            <p className="text-sm text-gray-700 font-semibold">Usuario</p>
            <button
              onClick={onLogout}
              className="text-sm text-blue-600 hover:underline"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
