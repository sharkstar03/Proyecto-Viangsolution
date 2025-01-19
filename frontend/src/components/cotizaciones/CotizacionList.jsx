// src/components/cotizaciones/CotizacionList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cotizacionService } from '../../services/cotizacion.service';
import { Alert } from '@/components/ui/alert';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '../../utils/formatters';

const CotizacionList = () => {
  const navigate = useNavigate();
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCotizaciones();
  }, []);

  const loadCotizaciones = async () => {
    try {
      const data = await cotizacionService.getAll();
      setCotizaciones(data);
      setError('');
    } catch (err) {
      setError('Error al cargar las cotizaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
      try {
        await cotizacionService.delete(id);
        await loadCotizaciones(); // Recargar la lista
        setError('');
      } catch (err) {
        setError('Error al eliminar la cotización');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cotizaciones</h1>
        <Button 
          onClick={() => navigate('/cotizaciones/new')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Nueva Cotización
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cotizaciones.map((cotizacion) => (
              <TableRow key={cotizacion.id}>
                <TableCell>{cotizacion.numero}</TableCell>
                <TableCell>{cotizacion.cliente}</TableCell>
                <TableCell>{formatDate(cotizacion.fecha)}</TableCell>
                <TableCell>{formatCurrency(cotizacion.total)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    cotizacion.estado === 'APROBADA' 
                      ? 'bg-green-100 text-green-800'
                      : cotizacion.estado === 'PENDIENTE'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {cotizacion.estado}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    className="mr-2"
                    onClick={() => navigate(`/cotizaciones/${cotizacion.id}`)}
                  >
                    Ver
                  </Button>
                  <Button
                    variant="ghost"
                    className="mr-2"
                    onClick={() => navigate(`/cotizaciones/${cotizacion.id}/edit`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(cotizacion.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {cotizaciones.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No hay cotizaciones disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CotizacionList;