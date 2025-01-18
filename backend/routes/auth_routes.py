from flask import Blueprint
from controllers.auth_controller import auth

auth_routes = Blueprint('auth_routes', __name__)

# Registrar las rutas de autenticación
auth_routes.register_blueprint(auth, url_prefix='/api')
