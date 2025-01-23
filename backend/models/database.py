# backend/models/database.py
from pymongo import MongoClient
from config import Config

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self):
        """Establece la conexión con MongoDB"""
        try:
            self.client = MongoClient(Config.MONGODB_URL)
            self.db = self.client[Config.DB_NAME]
            
            # Verificar la conexión haciendo una operación simple
            self.client.admin.command('ping')
            
            print("Conexión a la base de datos establecida")
        except Exception as e:
            print(f"Error conectando a la base de datos: {str(e)}")

    def get_db(self):
        """Obtiene la instancia de la base de datos"""
        if self.db is None:
            self.connect()
        return self.db

    def close(self):
        """Cierra la conexión con MongoDB"""
        if self.client is not None:
            self.client.close()

# Instancia global de la base de datos
database = Database()