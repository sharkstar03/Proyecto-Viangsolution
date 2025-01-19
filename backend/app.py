# backend/app.py
from flask import Flask, jsonify
from flask_cors import CORS
from routes.routes import (
    auth_bp,
    cotizaciones_bp,
    facturas_bp,
    payments_bp,
    reports_bp
)
from models.database import database
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# Crear aplicación Flask
app = Flask(__name__)

# Configuración básica
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'tu-clave-secreta-aqui')
app.config['MONGODB_URL'] = os.getenv('MONGODB_URL', 'mongodb://localhost:27017')
app.config['DB_NAME'] = os.getenv('DB_NAME', 'viangsolutions')
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB

# Configurar CORS
CORS(app, resources={
    r"/api/*": {
        "origins": os.getenv('CORS_ORIGINS', '*').split(','),
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Asegurar que existe el directorio de uploads
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Inicializar base de datos
database.connect()

# Registrar blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(cotizaciones_bp, url_prefix='/api/cotizaciones')
app.register_blueprint(facturas_bp, url_prefix='/api/facturas')
app.register_blueprint(payments_bp, url_prefix='/api/payments')
app.register_blueprint(reports_bp, url_prefix='/api/reports')

# Manejadores de errores
@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({
        'status': 'error',
        'message': 'Solicitud incorrecta',
        'details': str(error)
    }), 400

@app.errorhandler(401)
def unauthorized_error(error):
    return jsonify({
        'status': 'error',
        'message': 'No autorizado',
    }), 401

@app.errorhandler(403)
def forbidden_error(error):
    return jsonify({
        'status': 'error',
        'message': 'Acceso prohibido',
    }), 403

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        'status': 'error',
        'message': 'Recurso no encontrado',
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'status': 'error',
        'message': 'Error interno del servidor',
    }), 500

# Middleware para procesar antes de cada petición
@app.before_request
def before_request():
    """
    Acciones antes de cada petición
    - Verificar conexión a base de datos
    - Logging de peticiones
    - Validaciones generales
    """
    pass

# Middleware para procesar después de cada petición
@app.after_request
def after_request(response):
    """
    Acciones después de cada petición
    - Headers de seguridad
    - Logging de respuestas
    - Métricas
    """
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

# Ruta de status/health check
@app.route('/api/status')
def status():
    return jsonify({
        'status': 'success',
        'message': 'API funcionando correctamente',
        'version': '1.0.0'
    })

# Ruta raíz
@app.route('/')
def index():
    return jsonify({
        'name': 'VIANGSolutions API',
        'version': '1.0.0',
        'description': 'API para el sistema de cotizaciones y facturas',
        'status': 'online'
    })

# Solo ejecutar en desarrollo
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('ENVIRONMENT') != 'production'
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )