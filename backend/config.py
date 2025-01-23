# backend/config.py
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

class Config:
    # Configuración general
    SECRET_KEY = os.getenv('SECRET_KEY', 'tu-clave-secreta-aqui')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # MongoDB
    MONGODB_URL = os.getenv('MONGODB_URL', 'mongodb://localhost:27017')
    DB_NAME = os.getenv('DB_NAME', 'viangsolutions')
    
    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'tu-clave-jwt-aqui')
    JWT_ACCESS_TOKEN_EXPIRES = 24 * 60 * 60  # 24 horas
    JWT_EXPIRATION_DELTA = int(os.getenv('JWT_EXPIRATION_DELTA', 3600))  # En segundos
    
    # Upload
    UPLOAD_FOLDER = 'static/uploads'
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB
    
    # Configuración de aplicación
    APP_NAME = "VIANG Solutions"
    APP_VERSION = "1.0.0"
    
    # Configuración CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')

class DevelopmentConfig(Config):
    DEBUG = True
    ENV = 'development'

class ProductionConfig(Config):
    DEBUG = False
    ENV = 'production'

class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    DB_NAME = 'test_viangsolutions'

# Configuración por defecto basada en el entorno
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Obtiene la configuración basada en el entorno"""
    env = os.getenv('ENVIRONMENT', 'development')
    return config.get(env, config['default'])