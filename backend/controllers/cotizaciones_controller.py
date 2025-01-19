# backend/controllers/cotizaciones_controller.py
from flask import jsonify, request
from models.cotizacion import Cotizacion
from services.pdf_service import PDFService
from utils.auth_utils import requires_auth
from datetime import datetime

class CotizacionesController:
    def __init__(self):
        self.cotizacion_model = Cotizacion()
        self.pdf_service = PDFService()

    @requires_auth
    def get_cotizaciones(self):
        """Obtiene todas las cotizaciones"""
        try:
            cotizaciones = self.cotizacion_model.get_all()
            return jsonify({
                "status": "success",
                "cotizaciones": cotizaciones
            }), 200
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def create_cotizacion(self):
        """Crea una nueva cotización"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({
                    "status": "error",
                    "message": "No se proporcionaron datos"
                }), 400

            # Validar campos requeridos
            required_fields = ['nombre', 'correo', 'telefono', 'items']
            if not all(field in data for field in required_fields):
                return jsonify({
                    "status": "error",
                    "message": "Faltan campos requeridos"
                }), 400

            # Validar items
            if not data['items'] or not isinstance(data['items'], list):
                return jsonify({
                    "status": "error",
                    "message": "La cotización debe tener al menos un item"
                }), 400

            # Calcular totales
            subtotal = sum(item['precioUnitario'] * item['cantidad'] for item in data['items'])
            itbms = subtotal * 0.07
            total = subtotal + itbms

            data.update({
                'subtotal': subtotal,
                'itbms': itbms,
                'total': total
            })

            # Crear cotización
            cotizacion_id = self.cotizacion_model.create(data)

            return jsonify({
                "status": "success",
                "message": "Cotización creada exitosamente",
                "id": cotizacion_id
            }), 201

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def get_cotizacion(self, cotizacion_id):
        """Obtiene una cotización específica"""
        try:
            cotizacion = self.cotizacion_model.get_by_id(cotizacion_id)
            if not cotizacion:
                return jsonify({
                    "status": "error",
                    "message": "Cotización no encontrada"
                }), 404

            return jsonify({
                "status": "success",
                "cotizacion": cotizacion
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def update_cotizacion(self, cotizacion_id):
        """Actualiza una cotización"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({
                    "status": "error",
                    "message": "No se proporcionaron datos"
                }), 400

            # Recalcular totales si se actualizan los items
            if 'items' in data:
                subtotal = sum(item['precioUnitario'] * item['cantidad'] for item in data['items'])
                itbms = subtotal * 0.07
                total = subtotal + itbms

                data.update({
                    'subtotal': subtotal,
                    'itbms': itbms,
                    'total': total
                })

            success = self.cotizacion_model.update(cotizacion_id, data)
            if not success:
                return jsonify({
                    "status": "error",
                    "message": "Cotización no encontrada"
                }), 404

            return jsonify({
                "status": "success",
                "message": "Cotización actualizada exitosamente"
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def delete_cotizacion(self, cotizacion_id):
        """Elimina una cotización"""
        try:
            success = self.cotizacion_model.delete(cotizacion_id)
            if not success:
                return jsonify({
                    "status": "error",
                    "message": "Cotización no encontrada"
                }), 404

            return jsonify({
                "status": "success",
                "message": "Cotización eliminada exitosamente"
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def search_cotizaciones(self):
        """Búsqueda de cotizaciones"""
        try:
            query = request.args.get('q', '')
            cotizaciones = self.cotizacion_model.search(query)
            
            return jsonify({
                "status": "success",
                "cotizaciones": cotizaciones
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def generate_pdf(self, cotizacion_id):
        """Genera PDF de la cotización"""
        try:
            cotizacion = self.cotizacion_model.get_by_id(cotizacion_id)
            if not cotizacion:
                return jsonify({
                    "status": "error",
                    "message": "Cotización no encontrada"
                }), 404

            pdf = self.pdf_service.generar_cotizacion_pdf(cotizacion)
            
            return pdf, 200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': f'attachment; filename=cotizacion_{cotizacion["numeroCotizacion"]}.pdf'
            }

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def get_stats(self):
        """Obtiene estadísticas de cotizaciones"""
        try:
            stats = self.cotizacion_model.get_stats()
            return jsonify({
                "status": "success",
                "stats": stats
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500