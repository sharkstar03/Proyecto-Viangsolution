# backend/models/configuracion.py
from datetime import datetime
from .database import database

class Configuracion:
    def __init__(self):
        self.db = database.get_db()
        self.collection = self.db.configuracion

    def get_config(self):
        """Obtiene la configuración del sistema"""
        config = self.collection.find_one({"tipo": "general"})
        
        # Si no existe configuración, crear una por defecto
        if not config:
            config = {
                "tipo": "general",
                "empresa": {
                    "nombre": "VIANG SOLUTION & SERVICE",
                    "ruc": "8-731-875",
                    "dv": "74",
                    "telefono": "(+507) 6734-0816",
                    "correo": "vionel@viangsolution.com",
                    "direccion": "Llano Bonito Juan Dias Calle 18-Local 18-D",
                    "representante": "Vionel Angulo",
                    "cuenta_banco": "04-72-98-21-23-33-0",
                    "tipo_cuenta": "AHORRO",
                    "banco": "BANCO GENERAL",
                    "yappy": "6734-0816"
                },
                "cotizacion": {
                    "dias_validez": 15,
                    "formato_numero": "COT-{YYYY}-{0000}",
                    "terminos": [
                        "El 50% del monto total debe abonarse al aprobar esta cotización.",
                        "El saldo restante debe ser pagado al momento de la entrega del producto o finalización del servicio.",
                        "No se aceptan devoluciones ni reembolsos una vez aprobado el servicio.",
                        "Cualquier cambio en los requerimientos después de aprobada la cotización podrá generar un costo adicional."
                    ],
                    "itbms": 7
                },
                "factura": {
                    "formato_numero": "FAC-{YYYY}-{0000}",
                    "terminos": [
                        "Esta factura es un documento legal y comprobante de pago.",
                        "El pago debe realizarse en la fecha establecida."
                    ]
                },
                "archivos": {
                    "logo": None,
                    "watermark": None,
                    "yappy_logo": None
                },
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            }
            
            self.collection.insert_one(config)
        
        return config

    def update_config(self, data):
        """Actualiza la configuración del sistema"""
        try:
            data["updatedAt"] = datetime.now()
            result = self.collection.update_one(
                {"tipo": "general"},
                {"$set": data}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error actualizando configuración: {e}")
            return False

    def update_empresa_info(self, empresa_data):
        """Actualiza la información de la empresa"""
        try:
            result = self.collection.update_one(
                {"tipo": "general"},
                {
                    "$set": {
                        "empresa": empresa_data,
                        "updatedAt": datetime.now()
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error actualizando información de empresa: {e}")
            return False

    def update_terminos(self, tipo, terminos):
        """Actualiza los términos y condiciones"""
        try:
            if tipo not in ['cotizacion', 'factura']:
                return False

            result = self.collection.update_one(
                {"tipo": "general"},
                {
                    "$set": {
                        f"{tipo}.terminos": terminos,
                        "updatedAt": datetime.now()
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error actualizando términos: {e}")
            return False

    def update_archivo(self, tipo_archivo, filename):
        """Actualiza la referencia a un archivo"""
        try:
            if tipo_archivo not in ['logo', 'watermark', 'yappy_logo']:
                return False

            result = self.collection.update_one(
                {"tipo": "general"},
                {
                    "$set": {
                        f"archivos.{tipo_archivo}": filename,
                        "updatedAt": datetime.now()
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error actualizando archivo: {e}")
            return False