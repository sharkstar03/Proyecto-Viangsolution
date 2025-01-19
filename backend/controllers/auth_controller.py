# backend/controllers/auth_controller.py
from flask import jsonify, request
from models.user import User
from utils.auth_utils import generate_token, hash_password, verify_password
from services.notification_service import NotificationService
from datetime import datetime, timedelta
import jwt
from config import Config

class AuthController:
    def __init__(self):
        self.user_model = User()
        self.notification_service = NotificationService()

    def login(self):
        """Maneja el inicio de sesión de usuarios"""
        try:
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
            })

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
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    def register(self):
        """Registra un nuevo usuario"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({
                    "status": "error",
                    "message": "No se proporcionaron datos"
                }), 400

            # Validar campos requeridos
            required_fields = ['email', 'password', 'nombre']
            if not all(field in data for field in required_fields):
                return jsonify({
                    "status": "error",
                    "message": "Faltan campos requeridos"
                }), 400

            # Verificar si el email ya existe
            if self.user_model.get_by_email(data['email']):
                return jsonify({
                    "status": "error",
                    "message": "El email ya está registrado"
                }), 400

            # Hashear contraseña
            data['password'] = hash_password(data['password'])
            
            # Establecer rol por defecto
            data['role'] = 'user'
            
            # Crear usuario
            user_id = self.user_model.create(data)

            # Crear notificación
            self.notification_service.create_notification(
                user_id=user_id,
                type="registro",
                message="Registro exitoso. ¡Bienvenido!"
            )

            return jsonify({
                "status": "success",
                "message": "Usuario registrado exitosamente",
                "user_id": user_id
            }), 201

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    def change_password(self):
        """Cambio de contraseña"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({
                    "status": "error",
                    "message": "No se proporcionaron datos"
                }), 400

            # Validar campos requeridos
            if not all(k in data for k in ['current_password', 'new_password']):
                return jsonify({
                    "status": "error",
                    "message": "Faltan campos requeridos"
                }), 400

            # Obtener usuario actual
            user = self.user_model.get_by_id(request.user.get('id'))
            if not user:
                return jsonify({
                    "status": "error",
                    "message": "Usuario no encontrado"
                }), 404

            # Verificar contraseña actual
            if not verify_password(data['current_password'], user['password']):
                return jsonify({
                    "status": "error",
                    "message": "Contraseña actual incorrecta"
                }), 400

            # Actualizar contraseña
            new_password_hash = hash_password(data['new_password'])
            self.user_model.update_password(request.user.get('id'), new_password_hash)

            # Crear notificación
            self.notification_service.create_notification(
                user_id=request.user.get('id'),
                type="password_changed",
                message="Se ha cambiado la contraseña de tu cuenta"
            )

            return jsonify({
                "status": "success",
                "message": "Contraseña actualizada exitosamente"
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    def forgot_password(self):
        """Inicio de proceso de recuperación de contraseña"""
        try:
            data = request.get_json()
            if not data or 'email' not in data:
                return jsonify({
                    "status": "error",
                    "message": "Email requerido"
                }), 400

            # Verificar que el usuario existe
            user = self.user_model.get_by_email(data['email'])
            if not user:
                return jsonify({
                    "status": "error",
                    "message": "Email no encontrado"
                }), 404

            # Generar token de recuperación
            recovery_token = generate_token({
                'user_id': str(user['_id']),
                'type': 'password_recovery',
                'exp': datetime.utcnow() + timedelta(hours=1)
            })

            # Guardar token en la base de datos
            self.user_model.set_recovery_token(str(user['_id']), recovery_token)

            # Crear notificación
            self.notification_service.create_notification(
                user_id=str(user['_id']),
                type="password_recovery",
                message="Se ha iniciado el proceso de recuperación de contraseña"
            )

            return jsonify({
                "status": "success",
                "message": "Se ha enviado un email con las instrucciones"
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500