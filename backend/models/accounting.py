# backend/models/accounting.py
from datetime import datetime
from bson import ObjectId
from .database import database

class Accounting:
    def __init__(self):
        self.db = database.get_db()
        self.entries = self.db.accounting_entries
        self.accounts = self.db.accounts

    def create_entry(self, data):
        """Crea un asiento contable"""
        entry = {
            "fecha": datetime.now(),
            "tipo": data['tipo'],  # ingreso, egreso, ajuste
            "descripcion": data['descripcion'],
            "referencia": data.get('referencia'),  # ID de factura o documento relacionado
            "asientos": data['asientos'],  # Lista de débitos y créditos
            "total": data['total'],
            "estado": "pendiente",
            "createdAt": datetime.now(),
            "createdBy": data.get('userId'),
            "updatedAt": datetime.now()
        }

        result = self.entries.insert_one(entry)
        return str(result.inserted_id)

    def get_balance_sheet(self, fecha=None):
        """Genera balance general a una fecha específica"""
        if not fecha:
            fecha = datetime.now()

        pipeline = [
            {
                '$match': {
                    'fecha': {'$lte': fecha},
                    'estado': 'confirmado'
                }
            },
            {
                '$unwind': '$asientos'
            },
            {
                '$group': {
                    '_id': '$asientos.cuenta',
                    'debe': {
                        '$sum': {
                            '$cond': [
                                {'$eq': ['$asientos.tipo', 'debe']},
                                '$asientos.monto',
                                0
                            ]
                        }
                    },
                    'haber': {
                        '$sum': {
                            '$cond': [
                                {'$eq': ['$asientos.tipo', 'haber']},
                                '$asientos.monto',
                                0
                            ]
                        }
                    }
                }
            },
            {
                '$project': {
                    'cuenta': '$_id',
                    'saldo': {'$subtract': ['$debe', '$haber']}
                }
            }
        ]

        return list(self.entries.aggregate(pipeline))

    def get_income_statement(self, start_date, end_date):
        """Genera estado de resultados para un período"""
        pipeline = [
            {
                '$match': {
                    'fecha': {
                        '$gte': start_date,
                        '$lte': end_date
                    },
                    'estado': 'confirmado'
                }
            },
            {
                '$unwind': '$asientos'
            },
            {
                '$match': {
                    'asientos.categoria': {
                        '$in': ['ingresos', 'gastos']
                    }
                }
            },
            {
                '$group': {
                    '_id': {
                        'categoria': '$asientos.categoria',
                        'subcategoria': '$asientos.subcategoria'
                    },
                    'total': {
                        '$sum': '$asientos.monto'
                    }
                }
            }
        ]

        return list(self.entries.aggregate(pipeline))

    def get_cash_flow(self, start_date, end_date):
        """Genera flujo de efectivo para un período"""
        pipeline = [
            {
                '$match': {
                    'fecha': {
                        '$gte': start_date,
                        '$lte': end_date
                    },
                    'estado': 'confirmado'
                }
            },
            {
                '$unwind': '$asientos'
            },
            {
                '$match': {
                    'asientos.afecta_efectivo': True
                }
            },
            {
                '$group': {
                    '_id': {
                        'tipo': '$tipo',
                        'categoria': '$asientos.categoria'
                    },
                    'total': {
                        '$sum': '$asientos.monto'
                    }
                }
            }
        ]

        return list(self.entries.aggregate(pipeline))

    def get_account_movements(self, account_id, start_date, end_date):
        """Obtiene movimientos de una cuenta específica"""
        movements = list(self.entries.find({
            'fecha': {
                '$gte': start_date,
                '$lte': end_date
            },
            'asientos.cuenta': account_id,
            'estado': 'confirmado'
        }).sort('fecha', 1))

        for movement in movements:
            movement['_id'] = str(movement['_id'])
        return movements

    def get_accounts_receivable_aging(self):
        """Genera reporte de antigüedad de cuentas por cobrar"""
        pipeline = [
            {
                '$match': {
                    'asientos.cuenta': 'cuentas_por_cobrar',
                    'estado': 'confirmado'
                }
            },
            {
                '$project': {
                    'fecha': 1,
                    'referencia': 1,
                    'total': 1,
                    'dias_vencido': {
                        '$divide': [
                            {'$subtract': [datetime.now(), '$fecha']},
                            1000 * 60 * 60 * 24  # Convertir a días
                        ]
                    }
                }
            },
            {
                '$group': {
                    '_id': {
                        '$switch': {
                            'branches': [
                                {'case': {'$lt': ['$dias_vencido', 30]}, 'then': '0-30'},
                                {'case': {'$lt': ['$dias_vencido', 60]}, 'then': '31-60'},
                                {'case': {'$lt': ['$dias_vencido', 90]}, 'then': '61-90'}
                            ],
                            'default': '90+'
                        }
                    },
                    'total': {'$sum': '$total'},
                    'count': {'$sum': 1}
                }
            }
        ]

        return list(self.entries.aggregate(pipeline))

    def confirm_entry(self, entry_id):
        """Confirma un asiento contable"""
        try:
            result = self.entries.update_one(
                {'_id': ObjectId(entry_id)},
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