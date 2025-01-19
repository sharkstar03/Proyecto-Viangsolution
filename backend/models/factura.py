# backend/models/factura.py
from datetime import datetime
from bson import ObjectId
from .database import database

class Factura:
    def __init__(self):
        self.db = database.get_db()
        self.collection = self.db.facturas

    def create_from_cotizacion(self, cotizacion_data):
        """Crea una factura a partir de una cotización"""
        # Generar número de factura
        year = datetime.now().year
        count = self.collection.count_documents({}) + 1
        numero_factura = f"FAC-{year}-{str(count).zfill(4)}"

        factura = {
            "numeroFactura": numero_factura,
            "cotizacionId": str(cotizacion_data['_id']),
            "numeroCotizacion": cotizacion_data['numeroCotizacion'],
            "fecha": datetime.now(),
            "cliente": {
                "nombre": cotizacion_data['nombre'],
                "correo": cotizacion_data['correo'],
                "telefono": cotizacion_data['telefono'],
                "empresa": cotizacion_data.get('empresa'),
                "ruc": cotizacion_data.get('ruc')
            },
            "items": cotizacion_data['items'],
            "subtotal": cotizacion_data['subtotal'],
            "itbms": cotizacion_data['itbms'],
            "total": cotizacion_data['total'],
            "status": "pendiente",
            "metodoPago": None,
            "fechaPago": None,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }

        result = self.collection.insert_one(factura)
        return str(result.inserted_id)

    def get_all(self):
        """Obtiene todas las facturas"""
        facturas = list(self.collection.find().sort('createdAt', -1))
        for factura in facturas:
            factura['_id'] = str(factura['_id'])
        return facturas

    def get_by_id(self, id):
        """Obtiene una factura por ID"""
        try:
            factura = self.collection.find_one({'_id': ObjectId(id)})
            if factura:
                factura['_id'] = str(factura['_id'])
            return factura
        except:
            return None

    def update(self, id, data):
        """Actualiza una factura"""
        try:
            data['updatedAt'] = datetime.now()
            result = self.collection.update_one(
                {'_id': ObjectId(id)},
                {'$set': data}
            )
            return result.modified_count > 0
        except:
            return False

    def register_payment(self, id, payment_data):
        """Registra un pago en la factura"""
        try:
            update_data = {
                'status': 'pagada',
                'metodoPago': payment_data['metodoPago'],
                'fechaPago': datetime.now(),
                'updatedAt': datetime.now()
            }
            result = self.collection.update_one(
                {'_id': ObjectId(id)},
                {'$set': update_data}
            )
            return result.modified_count > 0
        except:
            return False

    def get_pending_payments(self):
        """Obtiene facturas pendientes de pago"""
        facturas = list(self.collection.find({
            'status': 'pendiente'
        }).sort('fecha', 1))
        
        for factura in facturas:
            factura['_id'] = str(factura['_id'])
        return facturas

    def get_stats(self):
        """Obtiene estadísticas de facturas"""
        total_count = self.collection.count_documents({})
        pending_count = self.collection.count_documents({'status': 'pendiente'})
        paid_count = self.collection.count_documents({'status': 'pagada'})

        pipeline = [
            {
                '$group': {
                    '_id': None,
                    'total_amount': {'$sum': '$total'},
                    'average_amount': {'$avg': '$total'},
                    'total_collected': {
                        '$sum': {
                            '$cond': [
                                {'$eq': ['$status', 'pagada']},
                                '$total',
                                0
                            ]
                        }
                    }
                }
            }
        ]
        
        result = list(self.collection.aggregate(pipeline))
        stats = result[0] if result else {
            'total_amount': 0, 
            'average_amount': 0,
            'total_collected': 0
        }

        return {
            'total_count': total_count,
            'pending_count': pending_count,
            'paid_count': paid_count,
            'total_amount': stats['total_amount'],
            'average_amount': stats['average_amount'],
            'total_collected': stats['total_collected']
        }