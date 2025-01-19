# backend/controllers/facturas_controller.py
from flask import jsonify, request, send_file
from models.factura import Factura
from models.cotizacion import Cotizacion
from models.payment import Payment
from services.pdf_service import PDFService
from services.notification_service import NotificationService
from utils.auth_utils import requires_auth
from datetime import datetime
import io

class FacturasController:
    def __init__(self):
        self.factura_model = Factura()
        self.cotizacion_model = Cotizacion()
        self.payment_model = Payment()
        self.pdf_service = PDFService()
        self.notification_service = NotificationService()

    @requires_auth
    def crear_desde_cotizacion(self, cotizacion_id):
        """Crea una factura a partir de una cotización"""
        try:
            # Obtener la cotización
            cotizacion = self.cotizacion_model.get_by_id(cotizacion_id)
            if not cotizacion:
                return jsonify({
                    "status": "error",
                    "message": "Cotización no encontrada"
                }), 404

            # Verificar que la cotización esté aprobada
            if cotizacion['status'] != 'aprobada':
                return jsonify({
                    "status": "error",
                    "message": "La cotización debe estar aprobada para generar una factura"
                }), 400

            # Crear la factura
            factura_id = self.factura_model.create_from_cotizacion(cotizacion)

            # Actualizar estado de la cotización
            self.cotizacion_model.update(cotizacion_id, {"status": "facturada"})

            # Crear notificación
            self.notification_service.create_notification(
                user_id=request.user.get('id'),
                type="factura_creada",
                message=f"Se ha creado la factura #{factura_id} desde la cotización #{cotizacion['numeroCotizacion']}"
            )

            return jsonify({
                "status": "success",
                "message": "Factura creada exitosamente",
                "factura_id": factura_id
            }), 201

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def get_facturas(self):
        """Obtiene todas las facturas"""
        try:
            facturas = self.factura_model.get_all()
            return jsonify({
                "status": "success",
                "facturas": facturas
            }), 200
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def get_factura(self, factura_id):
        """Obtiene una factura específica"""
        try:
            factura = self.factura_model.get_by_id(factura_id)
            if not factura:
                return jsonify({
                    "status": "error",
                    "message": "Factura no encontrada"
                }), 404

            return jsonify({
                "status": "success",
                "factura": factura
            }), 200
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def registrar_pago(self, factura_id):
        """Registra un pago para una factura"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({
                    "status": "error",
                    "message": "No se proporcionaron datos"
                }), 400

            # Validar datos del pago
            required_fields = ['monto', 'metodoPago']
            if not all(field in data for field in required_fields):
                return jsonify({
                    "status": "error",
                    "message": "Faltan campos requeridos"
                }), 400

            factura = self.factura_model.get_by_id(factura_id)
            if not factura:
                return jsonify({
                    "status": "error",
                    "message": "Factura no encontrada"
                }), 404

            # Registrar pago
            data['facturaId'] = factura_id
            payment_id = self.payment_model.create(data)

            # Crear notificación
            self.notification_service.create_notification(
                user_id=request.user.get('id'),
                type="pago_registrado",
                message=f"Se ha registrado un pago de ${data['monto']} para la factura #{factura['numeroFactura']}"
            )

            return jsonify({
                "status": "success",
                "message": "Pago registrado exitosamente",
                "payment_id": payment_id
            }), 201

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def generate_pdf(self, factura_id):
        """Genera PDF de la factura"""
        try:
            factura = self.factura_model.get_by_id(factura_id)
            if not factura:
                return jsonify({
                    "status": "error",
                    "message": "Factura no encontrada"
                }), 404

            pdf = self.pdf_service.generar_factura_pdf(factura)
            
            return send_file(
                io.BytesIO(pdf),
                mimetype='application/pdf',
                as_attachment=True,
                download_name=f'factura_{factura["numeroFactura"]}.pdf'
            )

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500