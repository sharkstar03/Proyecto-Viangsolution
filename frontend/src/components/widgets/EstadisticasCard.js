import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EstadisticasCard = ({ icon, title, value, color = "blue-500" }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow">
      {/* Ícono */}
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full bg-${color} bg-opacity-20`}
      >
        <FontAwesomeIcon icon={icon} className={`text-${color} text-2xl`} />
      </div>

      {/* Contenido */}
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

EstadisticasCard.propTypes = {
  icon: PropTypes.object.isRequired, // Ícono de FontAwesome
  title: PropTypes.string.isRequired, // Título de la estadística
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Valor numérico o texto
  color: PropTypes.string, // Color de fondo e ícono (opcional)
};

export default EstadisticasCard;
