// src/components/facturas/FacturaList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { facturaService } from '../../services/factura.service';
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Mail, FileText, Trash } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';

const FacturaList = () => {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFacturas();
  }, []);

  const loadFacturas = async () => {
    try {
      const data = await facturaService.getAll();
      setFacturas(data);
      setError('');
    } catch (err) {
      setError('Error al cargar las facturas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      try {
        await facturaService.delete(id);
        await loadFacturas();
        setError('');
      } catch (err) {
        setError('Error al eliminar la factura');
        console.error(err);
      }
    }
  };

  const handleGeneratePDF = async (id) => {
    try {
      await facturaService.generatePDF(id);
      setError('');
    } catch (err) {
      setError('Error al generar el PDF de la factura');
      console.error(err);
    }
  };

  const handleSendEmail = async (id) => {
    try {
      await facturaService.sendByEmail(id, { /* email config */ });
      setError('');
    } catch (err) {
      setError('Error al enviar la factura por email');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Facturas</h1>
        <Button 
          onClick={() => navigate('/facturas/new')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Nueva Factura
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
            {facturas.map((factura) => (
              <TableRow key={factura.id}>
                <TableCell>{factura.numero}</TableCell>
                <TableCell>{factura.cliente}</TableCell>
                <TableCell>{formatDate(factura.fecha)}</TableCell>
                <TableCell>{formatCurrency(factura.total)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    factura.estado === 'PAGADA' 
                      ? 'bg-green-100 text-green-800'
                      : factura.estado === 'PENDIENTE'
                      ? 'bg-yellow-100 text-yellow-800'
                      : factura.estado === 'VENCIDA'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {factura.estado}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => navigate(`/facturas/${factura.id}`)}
                      >
                        Ver Detalle
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate(`/facturas/${factura.id}/edit`)}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleGeneratePDF(factura.id)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Generar PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSendEmail(factura.id)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar por Email
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(factura.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {facturas.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No hay facturas disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FacturaList;