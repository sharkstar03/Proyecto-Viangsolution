// src/components/facturas/FacturaForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { facturaService } from '../../services/factura.service';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FacturaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    serie: '',
    folio: '',
    fecha: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
    cliente: '',
    rfc: '',
    direccion: '',
    email: '',
    telefono: '',
    estado: 'PENDIENTE',
    metodoPago: '',
    formaPago: '',
    usoCFDI: '',
    items: [],
    subtotal: 0,
    iva: 0,
    total: 0,
    notas: ''
  });

  const [newItem, setNewItem] = useState({
    descripcion: '',
    cantidad: 1,
    precio: 0,
    subtotal: 0
  });

  const metodosPago = [
    { value: 'PUE', label: 'Pago en una sola exhibición' },
    { value: 'PPD', label: 'Pago en parcialidades o diferido' }
  ];

  const formasPago = [
    { value: '01', label: 'Efectivo' },
    { value: '02', label: 'Cheque nominativo' },
    { value: '03', label: 'Transferencia electrónica' },
    { value: '04', label: 'Tarjeta de crédito' },
    { value: '28', label: 'Tarjeta de débito' }
  ];

  const usosCFDI = [
    { value: 'G01', label: 'Adquisición de mercancías' },
    { value: 'G02', label: 'Devoluciones, descuentos o bonificaciones' },
    { value: 'G03', label: 'Gastos en general' },
    { value: 'P01', label: 'Por definir' }
  ];

  useEffect(() => {
    if (id) {
      loadFactura();
    }
  }, [id]);

  const loadFactura = async () => {
    try {
      setLoading(true);
      const data = await facturaService.getById(id);
      setFormData(data);
    } catch (err) {
      setError('Error al cargar la factura');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateItemSubtotal = (cantidad, precio) => {
    return cantidad * precio;
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'cantidad' || name === 'precio') {
        updated.subtotal = calculateItemSubtotal(
          name === 'cantidad' ? Number(value) : Number(prev.cantidad),
          name === 'precio' ? Number(value) : Number(prev.precio)
        );
      }
      return updated;
    });
  };

  const addItem = () => {
    if (!newItem.descripcion || newItem.cantidad <= 0 || newItem.precio <= 0) {
      setError('Por favor complete todos los campos del item correctamente');
      return;
    }

    setFormData(prev => {
      const updatedItems = [...prev.items, { ...newItem, id: Date.now() }];
      const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      const iva = subtotal * 0.16;
      return {
        ...prev,
        items: updatedItems,
        subtotal,
        iva,
        total: subtotal + iva
      };
    });

    setNewItem({
      descripcion: '',
      cantidad: 1,
      precio: 0,
      subtotal: 0
    });
    setError('');
  };

  const removeItem = (itemId) => {
    setFormData(prev => {
      const updatedItems = prev.items.filter(item => item.id !== itemId);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
      const iva = subtotal * 0.16;
      return {
        ...prev,
        items: updatedItems,
        subtotal,
        iva,
        total: subtotal + iva
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      setError('Debe agregar al menos un item a la factura');
      return;
    }

    try {
      setLoading(true);
      if (id) {
        await facturaService.update(id, formData);
      } else {
        await facturaService.create(formData);
      }
      navigate('/facturas');
    } catch (err) {
      setError('Error al guardar la factura');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id ? 'Editar Factura' : 'Nueva Factura'}
        </h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información General */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="serie">Serie</Label>
            <Input
              id="serie"
              name="serie"
              value={formData.serie}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="folio">Folio</Label>
            <Input
              id="folio"
              name="folio"
              value={formData.folio}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="fecha">Fecha de Emisión</Label>
            <Input
              id="fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Información del Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cliente">Cliente</Label>
            <Input
              id="cliente"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="rfc">RFC</Label>
            <Input
              id="rfc"
              name="rfc"
              value={formData.rfc}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Información Fiscal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="metodoPago">Método de Pago</Label>
            <Select
              value={formData.metodoPago}
              onValueChange={(value) => handleSelectChange('metodoPago', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione método de pago" />
              </SelectTrigger>
              <SelectContent>
                {metodosPago.map(metodo => (
                  <SelectItem key={metodo.value} value={metodo.value}>
                    {metodo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="formaPago">Forma de Pago</Label>
            <Select
              value={formData.formaPago}
              onValueChange={(value) => handleSelectChange('formaPago', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione forma de pago" />
              </SelectTrigger>
              <SelectContent>
                {formasPago.map(forma => (
                  <SelectItem key={forma.value} value={forma.value}>
                    {forma.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="usoCFDI">Uso de CFDI</Label>
            <Select
              value={formData.usoCFDI}
              onValueChange={(value) => handleSelectChange('usoCFDI', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione uso de CFDI" />
              </SelectTrigger>
              <SelectContent>
                {usosCFDI.map(uso => (
                  <SelectItem key={uso.value} value={uso.value}>
                    {uso.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Items de la Factura */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Items</h2>
          
          {/* Agregar Nuevo Item */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                name="descripcion"
                value={newItem.descripcion}
                onChange={handleNewItemChange}
              />
            </div>
            <div>
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                name="cantidad"
                type="number"
                min="1"
                value={newItem.cantidad}
                onChange={handleNewItemChange}
              />
            </div>
            <div>
              <Label htmlFor="precio">Precio Unitario</Label>
              <Input
                id="precio"
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={newItem.precio}
                onChange={handleNewItemChange}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                onClick={addItem}
                className="w-full"
              >
                Agregar Item
              </Button>
            </div>
          </div>

          {/* Lista de Items */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unit.</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>${item.precio.toFixed(2)}</TableCell>
                    <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {formData.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No hay items agregados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Totales */}
        <div className="space-y-2">
          <div className="flex justify-end">
            <span className="w-32 text-right">Subtotal: ${formData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-end">
            <span className="w-32 text-right">IVA (16%): ${formData.iva.toFixed(2)}</span>
          </div>
          <div className="flex justify-end">
            <span className="w-32 text-right font-bold">Total: ${formData.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Notas */}
        <div>
          <Label htmlFor="notas">Notas</Label>
          <Input
            id="notas"
            name="notas"
            value={formData.notas}
            onChange={handleChange}
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/facturas')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Factura'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FacturaForm;