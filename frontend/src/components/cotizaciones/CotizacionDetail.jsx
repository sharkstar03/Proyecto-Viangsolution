// src/components/cotizaciones/CotizacionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cotizacionService } from '../../services/cotizacion.service';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '../../utils/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CotizacionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cotizacion, setCotizacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCotizacion();
  }, [id]);

  const loadCotizacion = async () => {
    try {
      const data = await cotizacionService.getById(id);
      setCotizacion(data);
    } catch (err) {
      setError('Error al cargar la cotización');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      await cotizacionService.update(id, { ...cotizacion, estado: newStatus });
      loadCotizacion();
    } catch (err) {
      setError('Error al actualizar el estado');
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  if (!cotizacion) {
    return (
      <Alert variant="destructive">
        Cotización no encontrada
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalle de Cotización</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate('/cotizaciones')}
          >
            Volver
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
          >
            Imprimir
          </Button>
          <Button
            onClick={() => navigate(`/cotizaciones/${id}/edit`)}
          >
            Editar
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2">
              <span className="font-medium">Número:</span>
              <span>{cotizacion.numero}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Fecha:</span>
              <span>{formatDate(cotizacion.fecha)}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Estado:</span>
              <span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  cotizacion.estado === 'APROBADA' 
                    ? 'bg-green-100 text-green-800'
                    : cotizacion.estado === 'PENDIENTE'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {cotizacion.estado}
                </span>
              </span>
            </div>
          </CardContent>
          {cotizacion.estado === 'PENDIENTE' && (
            <CardFooter className="space-x-2">
              <Button
                variant="outline"
                className="bg-green-50 text-green-600 hover:bg-green-100"
                onClick={() => handleChangeStatus('APROBADA')}
              >
                Aprobar
              </Button>
              <Button
                variant="outline"
                className="bg-red-50 text-red-600 hover:bg-red-100"
                onClick={() => handleChangeStatus('RECHAZADA')}
              >
                Rechazar
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Información del Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2">
              <span className="font-medium">Cliente:</span>
              <span>{cotizacion.cliente}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">RFC:</span>
              <span>{cotizacion.rfc}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Email:</span>
              <span>{cotizacion.email}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Teléfono:</span>
              <span>{cotizacion.telefono}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Dirección:</span>
              <span>{cotizacion.direccion}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items de la Cotización */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Items de la Cotización</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio Unit.</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cotizacion.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.descripcion}</TableCell>
                  <TableCell>{item.cantidad}</TableCell>
                  <TableCell>{formatCurrency(item.precio)}</TableCell>
                  <TableCell>{formatCurrency(item.subtotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 space-y-2">
            <div className="flex justify-end">
              <span className="w-32 text-right">Subtotal: {formatCurrency(cotizacion.subtotal)}</span>
            </div>
            <div className="flex justify-end">
              <span className="w-32 text-right">IVA (16%): {formatCurrency(cotizacion.iva)}</span>
            </div>
            <div className="flex justify-end">
              <span className="w-32 text-right font-bold">Total: {formatCurrency(cotizacion.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notas */}
      {cotizacion.notas && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{cotizacion.notas}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CotizacionDetail;