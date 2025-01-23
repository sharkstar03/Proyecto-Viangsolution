# backend/models/user.py
from datetime import datetime
from bson import ObjectId
from werkzeug.security import generate_password_hash
from .database import database

class User:
    def __init__(self):
        self.db = database.get_db()
        self.collection = self.db['users']  # Asegúrate de que la colección es 'users'

    def create(self, data):
        """Crea un nuevo usuario"""
        user = {
            "email": data['email'],
            "password": data['password'],  # Ya debe venir hasheada
            "nombre": data['nombre'],
            "role": data.get('role', 'user'),
            "active": True,
            "createdAt": datetime.now(),
            "lastLogin": None,
            "settings": {
                "language": "es",
                "theme": "light",
                "notifications": True
            },
            "permissions": []
        }

        result = self.collection.insert_one(user)
        return str(result.inserted_id)

    def get_by_id(self, id):
        """Obtiene un usuario por ID"""
        try:
            user = self.collection.find_one({'_id': ObjectId(id)})
            if user:
                user['_id'] = str(user['_id'])
                user.pop('password', None)  # No devolver la contraseña
            return user
        except:
            return None

    def get_by_email(self, email):
        """Obtiene un usuario por email"""
        return self.collection.find_one({'email': email})

    def update(self, id, data):
        """Actualiza un usuario"""
        try:
            # No permitir actualizar ciertos campos directamente
            data.pop('password', None)
            data.pop('role', None)
            data.pop('active', None)

            data['updatedAt'] = datetime.now()

            result = self.collection.update_one(
                {'_id': ObjectId(id)},
                {'$set': data}
            )
            return result.modified_count > 0
        except:
            return False

    def update_password(self, id, new_password):
        """Actualiza la contraseña de un usuario"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(id)},
                {
                    '$set': {
                        'password': new_password,
                        'updatedAt': datetime.now()
                    }
                }
            )
            return result.modified_count > 0
        except:
            return False

    def update_last_login(self, id):
        """Actualiza la fecha del último login"""
        try:
            self.collection.update_one(
                {'_id': ObjectId(id)},
                {'$set': {'lastLogin': datetime.now()}}
            )
            return True
        except:
            return False

    def deactivate(self, id):
        """Desactiva un usuario"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(id)},
                {
                    '$set': {
                        'active': False,
                        'updatedAt': datetime.now()
                    }
                }
            )
            return result.modified_count > 0
        except:
            return False

    def activate(self, id):
        """Activa un usuario"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(id)},
                {
                    '$set': {
                        'active': True,
                        'updatedAt': datetime.now()
                    }
                }
            )
            return result.modified_count > 0
        except:
            return False

    def set_role(self, id, role):
        """Establece el rol de un usuario"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(id)},
                {
                    '$set': {
                        'role': role,
                        'updatedAt': datetime.now()
                    }
                }
            )
            return result.modified_count > 0
        except:
            return False

    def add_permission(self, id, permission):
        """Añade un permiso específico a un usuario"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(id)},
                {
                    '$addToSet': {
                        'permissions': permission
                    },
                    '$set': {
                        'updatedAt': datetime.now()
                    }
                }
            )
            return result.modified_count > 0
        except:
            return False

    def remove_permission(self, id, permission):
        """Remueve un permiso específico de un usuario"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(id)},
                {
                    '$pull': {
                        'permissions': permission
                    },
                    '$set': {
                        'updatedAt': datetime.now()
                    }
                }
            )
            return result.modified_count > 0
        except:
            return False

    def set_recovery_token(self, id, token):
        """Establece un token de recuperación de contraseña"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(id)},
                {
                    '$set': {
                        'recovery_token': token,
                        'recovery_token_expires': datetime.now() + timedelta(hours=1)
                    }
                }
            )
            return result.modified_count > 0
        except:
            return False

    def clear_recovery_token(self, id):
        """Limpia el token de recuperación de contraseña"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(id)},
                {
                    '$unset': {
                        'recovery_token': "",
                        'recovery_token_expires': ""
                    }
                }
            )
            return result.modified_count > 0
        except:
            return False

    def update_settings(self, id, settings):
        """Actualiza las configuraciones del usuario"""
        try:
            result = self.collection.update_one(
                {'_id': ObjectId(id)},
                {
                    '$set': {
                        'settings': settings,
                        'updatedAt': datetime.now()
                    }
                }
            )
            return result.modified_count > 0
        except:
            return False