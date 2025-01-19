# backend/models/payment.py
from datetime import datetime
from bson import ObjectId
from .database import database

class Payment:
    def __init__(self):
        self.db = database.get_db()
        self.collection = self.db.payments

    def create(self, data):
        """Crea un nuevo registro de pago"""
        payment = {
            "facturaId": ObjectId(data['facturaId']),
            "monto": float(data['monto']),
            "metodoPago": data['metodoPago'],
            "referencia": data.get('referencia', ''),
            "estado": "pendiente",
            "fechaPago": datetime.now(),
            "comprobante": data.get('comprobante'),
            "notas": data.get('notas', ''),
            "createdAt": datetime.now(),
            "createdBy": data.get('userId'),
            "updatedAt": datetime.now()
        }

        result = self.collection.insert_one(payment)
        return str(result.inserted_id)

    def get_by_factura(self, factura_id):
        """Obtiene todos los pagos de una factura"""
        payments = list(self.collection.find({
            'facturaId': ObjectId(factura_id)
        }).sort('fechaPago', -1))

        for payment in payments:
            payment['_id'] = str(payment['_id'])
            payment['facturaId'] = str(payment['facturaId'])
        return payments

    def confirm_payment(self, payment_id):
        """Confirma un pago"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(payment_id)},
                {
                    '$set': {
                        'estado': 'confirmado',
                        'updatedAt': datetime.now()
                    }
                }
            )
            return result.modified_count > 0
        except:
            return False

    def get_payment_summary(self, start_date, end_date):
        """Obtiene resumen de pagos por período"""
        pipeline = [
            {
                '$match': {
                    'fechaPago': {
                        '$gte': start_date,
                        '$lte': end_date
                    },
                    'estado': 'confirmado'
                }
            },
            {
                '$group': {
                    '_id': '$metodoPago',
                    'total': {'$sum': '$monto'},
                    'count': {'$sum': 1}
                }
            }
        ]
        
        return list(self.collection.aggregate(pipeline))

    def get_pending_validations(self):
        """Obtiene pagos pendientes de validación"""
        payments = list(self.collection.find({
            'estado': 'pendiente'
        }).sort('fechaPago', 1))

        for payment in payments:
            payment['_id'] = str(payment['_id'])
            payment['facturaId'] = str(payment['facturaId'])
        return payments

    def get_payment_stats(self):
        """Obtiene estadísticas de pagos"""
        pipeline = [
            {
                '$group': {
                    '_id': '$metodoPago',
                    'total_amount': {'$sum': '$monto'},
                    'count': {'$sum': 1},
                    'avg_amount': {'$avg': '$monto'}
                }
            }
        ]
        
        return list(self.collection.aggregate(pipeline))