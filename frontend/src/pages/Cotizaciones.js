import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, 
  faUser, 
  faSearch, 
  faFileDownload, 
  faCopy,
  faPlus,
  faTrash,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/layout/Sidebar';

const CotizacionesPage = () => {
  const [activeView, setActiveView] = useState('select');
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    empresa: '',
    ubicacion: '',
    telefono: '',
    ruc: '',
    dv: '',
    fecha: new Date().toISOString().split('T')[0],
    productos: [],
  });

  const [recentCotizaciones] = useState([
    { id: 1, nombre_cliente: 'Juan Pérez', fecha: '2025-01-15', total: '150.00', tipo: 'personal' },
    { id: 2, nombre_cliente: 'Empresa ABC', fecha: '2025-01-16', total: '350.00', tipo: 'empresa' },
  ]);

  const calculateSubtotal = () => {
    return formData.productos
      .reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0)
      .toFixed(2);
  };

  const calculateITBMS = (subtotal) => {
    return (parseFloat(subtotal) * 0.07).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const itbms = parseFloat(calculateITBMS(subtotal));
    return (subtotal + itbms).toFixed(2);
  };

  const handleAddProduct = () => {
    setFormData({
      ...formData,
      productos: [
        ...formData.productos,
        {
          id: Date.now(),
          descripcion: '',
          cantidad: 1,
          precio_unitario: '0.00',
          total: '0.00'
        }
      ]
    });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = formData.productos.map((product, i) => {
      if (i === index) {
        const updatedProduct = { ...product, [field]: value };
        if (field === 'cantidad' || field === 'precio_unitario') {
          const cantidad = field === 'cantidad' ? parseFloat(value) || 0 : parseFloat(product.cantidad) || 0;
          const precioUnitario = field === 'precio_unitario' ? parseFloat(value) || 0 : parseFloat(product.precio_unitario) || 0;
          updatedProduct.total = (cantidad * precioUnitario).toFixed(2);
        }
        return updatedProduct;
      }
      return product;
    });

    setFormData({
      ...formData,
      productos: updatedProducts
    });
  };

  const handleRemoveProduct = (index) => {
    setFormData({
      ...formData,
      productos: formData.productos.filter((_, i) => i !== index)
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const renderFormView = () => {
    const isEmpresa = activeView === 'form-empresa';
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView('select')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEmpresa ? 'Cotización Empresarial' : 'Cotización Personal'}
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isEmpresa ? 'Empresa' : 'Nombre Cliente'}
              </label>
              <input
                type="text"
                value={isEmpresa ? formData.empresa : formData.nombre_cliente}
                onChange={(e) => handleInputChange(isEmpresa ? 'empresa' : 'nombre_cliente', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
              </label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {isEmpresa && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RUC
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.ruc}
                      onChange={(e) => handleInputChange('ruc', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={formData.dv}
                      onChange={(e) => handleInputChange('dv', e.target.value)}
                      placeholder="DV"
                      className="w-20 p-2 border border-l-0 border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Productos */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">Productos</h3>
              <button
                onClick={handleAddProduct}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Producto
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.productos.map((producto, index) => (
                    <tr key={producto.id}>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={producto.descripcion}
                          onChange={(e) => handleProductChange(index, 'descripcion', e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="1"
                          value={producto.cantidad}
                          onChange={(e) => handleProductChange(index, 'cantidad', e.target.value)}
                          className="w-24 p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={producto.precio_unitario}
                          onChange={(e) => handleProductChange(index, 'precio_unitario', e.target.value)}
                          className="w-32 p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        ${producto.total}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {formData.productos.length > 0 && (
              <div className="mt-4 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${calculateSubtotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ITBMS (7%):</span>
                    <span className="font-medium">${calculateITBMS(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setActiveView('select')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Generar Cotización
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSearchView = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView('select')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Búsqueda de Cotizaciones</h2>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre del cliente o empresa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Desde
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Hasta
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Buscar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSelectType = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cotizaciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cotización Empresarial */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faBuilding} className="text-blue-500 text-2xl" /></div>
            <h3 className="text-xl font-bold mb-2">Cotización Empresarial</h3>
            <p className="text-gray-600 mb-4">Crear una cotización para clientes empresariales</p>
            <button
              onClick={() => setActiveView('form-empresa')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Crear Cotización
            </button>
          </div>
        </div>

        {/* Cotización Personal */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faUser} className="text-green-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Cotización Personal</h3>
            <p className="text-gray-600 mb-4">Crear una cotización para clientes individuales</p>
            <button
              onClick={() => setActiveView('form-personal')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Crear Cotización
            </button>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faSearch} className="text-purple-500 text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Búsqueda Avanzada</h3>
            <p className="text-gray-600 mb-4">Buscar y gestionar cotizaciones existentes</p>
            <button
              onClick={() => setActiveView('search')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Buscar Cotizaciones
            </button>
          </div>
        </div>
      </div>

      {/* Cotizaciones Recientes */}
      {recentCotizaciones.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-xl font-bold mb-4">Cotizaciones Recientes</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentCotizaciones.map((cotizacion) => (
                  <tr key={cotizacion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FontAwesomeIcon 
                          icon={cotizacion.tipo === 'personal' ? faUser : faBuilding} 
                          className={`mr-3 ${cotizacion.tipo === 'personal' ? 'text-green-500' : 'text-blue-500'}`}
                        />
                        <div className="text-sm font-medium text-gray-900">
                          {cotizacion.nombre_cliente}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cotizacion.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${cotizacion.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Descargar PDF"
                      >
                        <FontAwesomeIcon icon={faFileDownload} />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        title="Duplicar cotización"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        {activeView === 'select' && renderSelectType()}
        {(activeView === 'form-empresa' || activeView === 'form-personal') && renderFormView()}
        {activeView === 'search' && renderSearchView()}
      </div>
    </div>
  );
};

export default CotizacionesPage;