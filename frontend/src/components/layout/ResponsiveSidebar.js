// src/components/layout/ResponsiveSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faHome,
  faFileInvoice,
  faUsers,
  faCog,
  faSignOutAlt,
  faBars
} from '@fortawesome/free-solid-svg-icons';

const ResponsiveSidebar = ({ isOpen, onToggle }) => {
  const menuItems = [
    { icon: faHome, text: 'Dashboard', path: '/dashboard' },
    { icon: faFileInvoice, text: 'Cotizaciones', path: '/cotizaciones' },
    { icon: faUsers, text: 'Clientes', path: '/clientes' },
    { icon: faCog, text: 'Configuración', path: '/configuracion' }
  ];

  return (
    <>
      {/* Burger Menu Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg lg:hidden"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-gray-600 text-xl" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        lg:relative lg:transform-none lg:transition-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Mi Empresa</h1>
            <button onClick={onToggle} className="lg:hidden text-gray-600">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => onToggle()}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer/Logout */}
          <div className="border-t p-4">
            <button 
              onClick={() => {/* Agregar lógica de logout */}}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ResponsiveSidebar;