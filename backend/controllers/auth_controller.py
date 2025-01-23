from flask import jsonify, request
from models.user import User
from utils.auth_utils import generate_token, hash_password, verify_password
from services.notification_service import NotificationService
from datetime import datetime
import jwt
from config import Config

class AuthController:
    def __init__(self):
        self.user_model = User()
        self.notification_service = NotificationService()
        self.config = Config()

    def login(self):
        try:
            if request.content_type != 'application/json':
                return jsonify({
                    "status": "error",
                    "message": "Content-Type debe ser application/json"
                }), 415

            data = request.get_json()
            if not data:
                return jsonify({
                    "status": "error",
                    "message": "No se proporcionaron credenciales"
                }), 400

            # Validar campos requeridos
            if not data.get('email') or not data.get('password'):
                return jsonify({
                    "status": "error",
                    "message": "Email y contraseña son requeridos"
                }), 400

            # Buscar usuario
            user = self.user_model.get_by_email(data['email'])
            if not user:
                return jsonify({
                    "status": "error",
                    "message": "Credenciales inválidas"
                }), 401

            # Verificar contraseña
            if not verify_password(data['password'], user['password']):
                return jsonify({
                    "status": "error",
                    "message": "Credenciales inválidas"
                }), 401

            # Generar token
            token = generate_token({
                'user_id': str(user['_id']),
                'email': user['email'],
                'role': user['role']
            }, self.config.JWT_SECRET_KEY)

            # Registrar último acceso
            self.user_model.update_last_login(str(user['_id']))

            # Crear notificación de inicio de sesión
            self.notification_service.create_notification(
                user_id=str(user['_id']),
                type="login",
                message=f"Inicio de sesión exitoso desde {request.user_agent.string}"
            )

            return jsonify({
                "status": "success",
                "token": token,
                "user": {
                    "id": str(user['_id']),
                    "email": user['email'],
                    "nombre": user['nombre'],
                    "role": user['role']
                }
            }), 200

        except Exception as e:
            print(f"Error en login: {str(e)}")
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    def register(self):
        try:
            if request.content_type != 'application/json':
                return jsonify({
                    "status": "error",
                    "message": "Content-Type debe ser application/json"
                }), 415

            data = request.get_json()
            if not data:
                return jsonify({
                    "status": "error",
                    "message": "No se proporcionaron datos"
                }), 400

            # Validar campos requeridos
            required_fields = ['email', 'password', 'nombre']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({
                        "status": "error",
                        "message": f"El campo {field} es requerido"
                    }), 400

            # Verificar si el usuario ya existe
            existing_user = self.user_model.get_by_email(data['email'])
            if existing_user:
                return jsonify({
                    "status": "error",
                    "message": "El email ya está registrado"
                }), 409

            # Hashear contraseña
            hashed_password = hash_password(data['password'])

            # Crear nuevo usuario
            new_user = {
                'email': data['email'],
                'password': hashed_password,
                'nombre': data['nombre'],
                'role': 'user',  # Role por defecto
                'created_at': datetime.utcnow(),
                'last_login': datetime.utcnow()
            }

            user_id = self.user_model.create(new_user)

            # Generar token
            token = generate_token({
                'user_id': str(user_id),
                'email': data['email'],
                'role': 'user'
            }, self.config.JWT_SECRET_KEY)

            # Crear notificación de bienvenida
            self.notification_service.create_notification(
                user_id=str(user_id),
                type="welcome",
                message=f"Bienvenido a VianGsolution, {data['nombre']}!"
            )

            return jsonify({
                "status": "success",
                "message": "Usuario registrado exitosamente",
                "token": token,
                "user": {
                    "id": str(user_id),
                    "email": data['email'],
                    "nombre": data['nombre'],
                    "role": 'user'
                }
            }), 201

        except Exception as e:
            print(f"Error en register: {str(e)}")
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500