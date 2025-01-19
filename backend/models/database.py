# backend/models/database.py
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

class Database:
    def __init__(self):
        self.client = None
        self.db = None
        self._connected = False

    def connect(self):
        """Establece la conexión con MongoDB"""
        try:
            # Obtener la URL de conexión desde variables de entorno
            mongodb_url = os.getenv('MONGODB_URL', 'mongodb://localhost:27017')
            self.client = MongoClient(mongodb_url)
            self.db = self.client[os.getenv('DB_NAME', 'viangsolutions')]
            
            # Verificar la conexión haciendo una operación simple
            self.client.admin.command('ping')
            
            self._connected = True
            print("Conexión exitosa a MongoDB")
        except Exception as e:
            print(f"Error al conectar a MongoDB: {e}")
            self._connected = False
            raise e

    def get_db(self):
        """Obtiene la instancia de la base de datos"""
        if not self._connected:
            self.connect()
        return self.db

    def close(self):
        """Cierra la conexión con MongoDB"""
        if self.client is not None:
            self.client.close()
            self._connected = False

# Instancia global de la base de datos
database = Database()