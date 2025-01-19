# backend/controllers/payment_controller.py
from flask import jsonify, request
from models.payment import Payment
from models.factura import Factura
from models.accounting import Accounting
from services.notification_service import NotificationService
from utils.auth_utils import requires_auth
from datetime import datetime

class PaymentController:
    def __init__(self):
        self.payment_model = Payment()
        self.factura_model = Factura()
        self.accounting_model = Accounting()
        self.notification_service = NotificationService()

    @requires_auth
    def get_payments(self):
        """Obtiene todos los pagos"""
        try:
            # Obtener filtros de la query
            factura_id = request.args.get('factura_id')
            status = request.args.get('status')
            fecha_inicio = request.args.get('fecha_inicio')
            fecha_fin = request.args.get('fecha_fin')

            # Aplicar filtros si existen
            filters = {}
            if factura_id:
                filters['facturaId'] = factura_id
            if status:
                filters['estado'] = status
            if fecha_inicio and fecha_fin:
                filters['fechaPago'] = {
                    '$gte': datetime.fromisoformat(fecha_inicio),
                    '$lte': datetime.fromisoformat(fecha_fin)
                }

            payments = self.payment_model.get_by_filters(filters)
            return jsonify({
                "status": "success",
                "payments": payments
            }), 200
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def create_payment(self):
        """Crea un nuevo registro de pago"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({
                    "status": "error",
                    "message": "No se proporcionaron datos"
                }), 400

            # Validar campos requeridos
            required_fields = ['facturaId', 'monto', 'metodoPago']
            if not all(field in data for field in required_fields):
                return jsonify({
                    "status": "error",
                    "message": "Faltan campos requeridos"
                }), 400

            # Validar que la factura exista
            factura = self.factura_model.get_by_id(data['facturaId'])
            if not factura:
                return jsonify({
                    "status": "error",
                    "message": "Factura no encontrada"
                }), 404

            # Validar monto del pago
            pagos_previos = self.payment_model.get_by_factura(data['facturaId'])
            total_pagado = sum(pago['monto'] for pago in pagos_previos)
            saldo_pendiente = factura['total'] - total_pagado

            if data['monto'] > saldo_pendiente:
                return jsonify({
                    "status": "error",
                    "message": "El monto excede el saldo pendiente"
                }), 400

            # Crear el pago
            data['userId'] = request.user.get('id')
            payment_id = self.payment_model.create(data)

            # Registrar asiento contable
            accounting_entry = {
                'tipo': 'ingreso',
                'descripcion': f"Pago de factura #{factura['numeroFactura']}",
                'referencia': payment_id,
                'asientos': [
                    {
                        'cuenta': 'caja',
                        'tipo': 'debe',
                        'monto': data['monto']
                    },
                    {
                        'cuenta': 'cuentas_por_cobrar',
                        'tipo': 'haber',
                        'monto': data['monto']
                    }
                ],
                'total': data['monto']
            }
            self.accounting_model.create_entry(accounting_entry)

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
    def confirm_payment(self, payment_id):
        """Confirma un pago"""
        try:
            # Validar que el pago exista
            payment = self.payment_model.get_by_id(payment_id)
            if not payment:
                return jsonify({
                    "status": "error",
                    "message": "Pago no encontrado"
                }), 404

            # Confirmar el pago
            success = self.payment_model.confirm_payment(payment_id)
            if not success:
                return jsonify({
                    "status": "error",
                    "message": "Error al confirmar el pago"
                }), 500

            # Crear notificación
            self.notification_service.create_notification(
                user_id=request.user.get('id'),
                type="pago_confirmado",
                message=f"Se ha confirmado el pago #{payment_id}"
            )

            return jsonify({
                "status": "success",
                "message": "Pago confirmado exitosamente"
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def get_payment_summary(self):
        """Obtiene resumen de pagos"""
        try:
            start_date = request.args.get('fecha_inicio')
            end_date = request.args.get('fecha_fin')

            if not start_date or not end_date:
                return jsonify({
                    "status": "error",
                    "message": "Se requieren fechas de inicio y fin"
                }), 400

            summary = self.payment_model.get_payment_summary(
                datetime.fromisoformat(start_date),
                datetime.fromisoformat(end_date)
            )

            return jsonify({
                "status": "success",
                "summary": summary
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def upload_payment_proof(self, payment_id):
        """Sube comprobante de pago"""
        try:
            if 'file' not in request.files:
                return jsonify({
                    "status": "error",
                    "message": "No se proporcionó ningún archivo"
                }), 400

            file = request.files['file']
            payment = self.payment_model.get_by_id(payment_id)
            
            if not payment:
                return jsonify({
                    "status": "error",
                    "message": "Pago no encontrado"
                }), 404

            # Guardar archivo
            filename = save_payment_proof(file, payment_id)
            self.payment_model.update(payment_id, {'comprobante': filename})

            # Crear notificación
            self.notification_service.create_notification(
                user_id=request.user.get('id'),
                type="comprobante_subido",
                message=f"Se ha subido el comprobante para el pago #{payment_id}"
            )

            return jsonify({
                "status": "success",
                "message": "Comprobante subido exitosamente",
                "filename": filename
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500