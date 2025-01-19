# backend/utils/auth_utils.py
from functools import wraps
from flask import request, jsonify
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from config import Config

def requires_auth(f):
    """Decorador para proteger rutas que requieren autenticación"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({
                "status": "error",
                "message": "Token no proporcionado"
            }), 401

        try:
            # Remover prefijo 'Bearer' si existe
            if token.startswith('Bearer '):
                token = token.split(' ')[1]

            # Decodificar token
            payload = jwt.decode(
                token,
                Config.SECRET_KEY,
                algorithms=["HS256"]
            )

            # Agregar información del usuario a request
            request.user = payload

        except jwt.ExpiredSignatureError:
            return jsonify({
                "status": "error",
                "message": "Token expirado"
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                "status": "error",
                "message": "Token inválido"
            }), 401

        return f(*args, **kwargs)
    return decorated

def requires_role(role):
    """Decorador para proteger rutas que requieren un rol específico"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.user:
                return jsonify({
                    "status": "error",
                    "message": "No autenticado"
                }), 401

            if request.user.get('role') != role:
                return jsonify({
                    "status": "error",
                    "message": "No autorizado"
                }), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator

def generate_token(data, expiration=24):
    """Genera un token JWT"""
    try:
        payload = {
            **data,
            'exp': datetime.utcnow() + timedelta(hours=expiration)
        }
        return jwt.encode(
            payload,
            Config.SECRET_KEY,
            algorithm="HS256"
        )
    except Exception as e:
        print(f"Error generando token: {e}")
        return None

def verify_token(token):
    """Verifica un token JWT"""
    try:
        return jwt.decode(
            token,
            Config.SECRET_KEY,
            algorithms=["HS256"]
        )
    except Exception as e:
        print(f"Error verificando token: {e}")
        return None

def hash_password(password):
    """Genera hash de contraseña"""
    try:
        return generate_password_hash(password, method='pbkdf2:sha256')
    except Exception as e:
        print(f"Error hasheando contraseña: {e}")
        return None

def verify_password(password, password_hash):
    """Verifica una contraseña contra su hash"""
    try:
        return check_password_hash(password_hash, password)
    except Exception as e:
        print(f"Error verificando contraseña: {e}")
        return False

class RoleBasedAccess:
    """Clase para manejar permisos basados en roles"""
    ROLES = {
        'admin': ['all'],
        'manager': [
            'view_reports',
            'manage_quotations',
            'manage_invoices',
            'manage_clients'
        ],
        'user': [
            'view_quotations',
            'create_quotations',
            'view_invoices'
        ]
    }

    @staticmethod
    def has_permission(user_role, permission):
        """Verifica si un rol tiene un permiso específico"""
        if user_role not in RoleBasedAccess.ROLES:
            return False
        
        permissions = RoleBasedAccess.ROLES[user_role]
        return 'all' in permissions or permission in permissions

    @staticmethod
    def get_user_permissions(user_role):
        """Obtiene todos los permisos de un rol"""
        if user_role not in RoleBasedAccess.ROLES:
            return []
        
        if 'all' in RoleBasedAccess.ROLES[user_role]:
            return [perm for role_perms in RoleBasedAccess.ROLES.values() 
                   for perm in role_perms if perm != 'all']
        
        return RoleBasedAccess.ROLES[user_role]

def requires_permission(permission):
    """Decorador para proteger rutas que requieren un permiso específico"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not request.user:
                return jsonify({
                    "status": "error",
                    "message": "No autenticado"
                }), 401

            if not RoleBasedAccess.has_permission(
                request.user.get('role'),
                permission
            ):
                return jsonify({
                    "status": "error",
                    "message": "No tiene permiso para realizar esta acción"
                }), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator