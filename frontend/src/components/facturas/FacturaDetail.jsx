// src/components/facturas/FacturaDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { facturaService } from '../../services/factura.service';
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
import { Mail, FileText, Printer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FacturaDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    loadFactura();
  }, [id]);

  const loadFactura = async () => {
    try {
      const data = await facturaService.getById(id);
      setFactura(data);
      setEmailData(prev => ({
        ...prev,
        to: data.email,
        subject: `Factura ${data.serie}-${data.folio}`,
        message: `Estimado ${data.cliente},\n\nAdjunto encontrará su factura ${data.serie}-${data.folio}.\n\nSaludos cordiales.`
      }));
    } catch (err) {
      setError('Error al cargar la factura');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      await facturaService.update(id, { ...factura, estado: newStatus });
      loadFactura();
    } catch (err) {
      setError('Error al actualizar el estado');
      console.error(err);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      await facturaService.generatePDF(id);
    } catch (err) {
      setError('Error al generar el PDF');
      console.error(err);
    }
  };

  const handleSendEmail = async () => {
    try {
      await facturaService.sendByEmail(id, emailData);
      setEmailDialogOpen(false);
    } catch (err) {
      setError('Error al enviar el email');
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  if (!factura) {
    return (
      <Alert variant="destructive">
        Factura no encontrada
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalle de Factura</h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleGeneratePDF}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generar PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => setEmailDialogOpen(true)}
          >
            <Mail className="mr-2 h-4 w-4" />
            Enviar por Email
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button
            onClick={() => navigate(`/facturas/${id}/edit`)}
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
            <CardTitle>Información de la Factura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2">
              <span className="font-medium">Serie-Folio:</span>
              <span>{factura.serie}-{factura.folio}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Fecha:</span>
              <span>{formatDate(factura.fecha)}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Estado:</span>
              <span>
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
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Método de Pago:</span>
              <span>{factura.metodoPago}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Forma de Pago:</span>
              <span>{factura.formaPago}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Uso CFDI:</span>
              <span>{factura.usoCFDI}</span>
            </div>
          </CardContent>
          {factura.estado === 'PENDIENTE' && (
            <CardFooter className="space-x-2">
              <Button
                variant="outline"
                className="bg-green-50 text-green-600 hover:bg-green-100"
                onClick={() => handleChangeStatus('PAGADA')}
              >
                Marcar como Pagada
              </Button>
              <Button
                variant="outline"
                className="bg-red-50 text-red-600 hover:bg-red-100"
                onClick={() => handleChangeStatus('VENCIDA')}
              >
                Marcar como Vencida
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
              <span>{factura.cliente}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">RFC:</span>
              <span>{factura.rfc}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Email:</span>
              <span>{factura.email}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Teléfono:</span>
              <span>{factura.telefono}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-medium">Dirección:</span>
              <span>{factura.direccion}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items de la Factura */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Items de la Factura</CardTitle>
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
              {factura.items.map((item, index) => (
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
              <span className="w-32 text-right">Subtotal: {formatCurrency(factura.subtotal)}</span>
            </div>
            <div className="flex justify-end">
              <span className="w-32 text-right">IVA (16%): {formatCurrency(factura.iva)}</span>
            </div>
            <div className="flex justify-end">
              <span className="w-32 text-right font-bold">Total: {formatCurrency(factura.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notas */}
      {factura.notas && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{factura.notas}</p>
          </CardContent>
        </Card>
      )}

      {/* Diálogo de Envío de Email */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Factura por Email</DialogTitle>
            <DialogDescription>
              Complete los detalles del email para enviar la factura.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Destinatario</Label>
              <Input
                id="email"
                value={emailData.to}
                onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                type="email"
              />
            </div>
            <div>
              <Label htmlFor="subject">Asunto</Label>
              <Input
                id="subject"
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="message">Mensaje</Label>
              <Input
                id="message"
                value={emailData.message}
                onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                className="h-24"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendEmail}>
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacturaDetail;