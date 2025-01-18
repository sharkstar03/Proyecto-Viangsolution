import React from "react";
import PropTypes from "prop-types";

const FactualItem = ({ title, subtitle, amount, date, onClick }) => {
  return (
    <div
      className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Información principal */}
      <div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* Detalles adicionales */}
      <div className="text-right">
        <p className="text-lg font-semibold text-blue-600">${amount}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
  );
};

FactualItem.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  date: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default FactualItem;
