# backend/models/cotizacion.py
from datetime import datetime
from bson import ObjectId
from .database import database

class Cotizacion:
    def __init__(self):
        self.db = database.get_db()
        self.collection = self.db.cotizaciones

    def create(self, data):
        """Crea una nueva cotización"""
        cotizacion = {
            "numeroCotizacion": self._generate_numero_cotizacion(),
            "fecha": datetime.now(),
            "nombre": data.get('nombre'),
            "correo": data.get('correo'),
            "telefono": data.get('telefono'),
            "empresa": data.get('empresa'),
            "ruc": data.get('ruc'),
            "tipo": data.get('tipo', 'personal'),
            "items": data.get('items', []),
            "subtotal": data.get('subtotal', 0),
            "itbms": data.get('itbms', 0),
            "total": data.get('total', 0),
            "status": "pendiente",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }

        result = self.collection.insert_one(cotizacion)
        return str(result.inserted_id)

    def get_all(self):
        """Obtiene todas las cotizaciones"""
        cotizaciones = list(self.collection.find().sort('createdAt', -1))
        for cotizacion in cotizaciones:
            cotizacion['_id'] = str(cotizacion['_id'])
        return cotizaciones

    def get_by_id(self, id):
        """Obtiene una cotización por ID"""
        try:
            cotizacion = self.collection.find_one({'_id': ObjectId(id)})
            if cotizacion:
                cotizacion['_id'] = str(cotizacion['_id'])
            return cotizacion
        except:
            return None

    def update(self, id, data):
        """Actualiza una cotización"""
        try:
            data['updatedAt'] = datetime.now()
            result = self.collection.update_one(
                {'_id': ObjectId(id)},
                {'$set': data}
            )
            return result.modified_count > 0
        except:
            return False

    def delete(self, id):
        """Elimina una cotización"""
        try:
            result = self.collection.delete_one({'_id': ObjectId(id)})
            return result.deleted_count > 0
        except:
            return False

    def search(self, query):
        """Busca cotizaciones por varios criterios"""
        filter = {
            '$or': [
                {'numeroCotizacion': {'$regex': query, '$options': 'i'}},
                {'nombre': {'$regex': query, '$options': 'i'}},
                {'empresa': {'$regex': query, '$options': 'i'}},
                {'correo': {'$regex': query, '$options': 'i'}}
            ]
        }
        cotizaciones = list(self.collection.find(filter).sort('createdAt', -1))
        for cotizacion in cotizaciones:
            cotizacion['_id'] = str(cotizacion['_id'])
        return cotizaciones

    def _generate_numero_cotizacion(self):
        """Genera un número de cotización único"""
        year = datetime.now().year
        count = self.collection.count_documents({}) + 1
        return f"COT-{year}-{str(count).zfill(4)}"

    def get_by_status(self, status):
        """Obtiene cotizaciones por estado"""
        cotizaciones = list(self.collection.find({'status': status}).sort('createdAt', -1))
        for cotizacion in cotizaciones:
            cotizacion['_id'] = str(cotizacion['_id'])
        return cotizaciones

    def get_stats(self):
        """Obtiene estadísticas de cotizaciones"""
        total_count = self.collection.count_documents({})
        pending_count = self.collection.count_documents({'status': 'pendiente'})
        approved_count = self.collection.count_documents({'status': 'aprobada'})
        rejected_count = self.collection.count_documents({'status': 'rechazada'})

        pipeline = [
            {
                '$group': {
                    '_id': None,
                    'total_amount': {'$sum': '$total'},
                    'average_amount': {'$avg': '$total'}
                }
            }
        ]
        
        result = list(self.collection.aggregate(pipeline))
        stats = result[0] if result else {'total_amount': 0, 'average_amount': 0}

        return {
            'total_count': total_count,
            'pending_count': pending_count,
            'approved_count': approved_count,
            'rejected_count': rejected_count,
            'total_amount': stats['total_amount'],
            'average_amount': stats['average_amount']
        }