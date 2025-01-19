// src/components/cotizaciones/CotizacionForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cotizacionService } from '../../services/cotizacion.service';
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

const CotizacionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    numero: '',
    fecha: new Date().toISOString().split('T')[0],
    cliente: '',
    rfc: '',
    direccion: '',
    email: '',
    telefono: '',
    estado: 'PENDIENTE',
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

  useEffect(() => {
    if (id) {
      loadCotizacion();
    }
  }, [id]);

  const loadCotizacion = async () => {
    try {
      setLoading(true);
      const data = await cotizacionService.getById(id);
      setFormData(data);
    } catch (err) {
      setError('Error al cargar la cotización');
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
      setError('Debe agregar al menos un item a la cotización');
      return;
    }

    try {
      setLoading(true);
      if (id) {
        await cotizacionService.update(id, formData);
      } else {
        await cotizacionService.create(formData);
      }
      navigate('/cotizaciones');
    } catch (err) {
      setError('Error al guardar la cotización');
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
          {id ? 'Editar Cotización' : 'Nueva Cotización'}
        </h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información General */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="numero">Número de Cotización</Label>
            <Input
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="fecha">Fecha</Label>
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
            />
          </div>
        </div>

        {/* Items de la Cotización */}
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

        {/* Notas y Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="notas">Notas</Label>
            <Input
              id="notas"
              name="notas"
              value={formData.notas}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={formData.estado}
              onValueChange={(value) => handleChange({ target: { name: 'estado', value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="APROBADA">Aprobada</SelectItem>
                <SelectItem value="RECHAZADA">Rechazada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/cotizaciones')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Cotización'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CotizacionForm;