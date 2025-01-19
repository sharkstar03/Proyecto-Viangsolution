# backend/services/notification_service.py
from datetime import datetime
from models.database import database

class NotificationService:
    def __init__(self):
        self.db = database.get_db()
        self.notifications = self.db.notifications
        self.ws_connections = set()

    def add_connection(self, websocket):
        """Añade una nueva conexión WebSocket"""
        self.ws_connections.add(websocket)

    def remove_connection(self, websocket):
        """Elimina una conexión WebSocket"""
        self.ws_connections.remove(websocket)

    def broadcast(self, message):
        """Envía un mensaje a todas las conexiones activas"""
        inactive_connections = set()
        
        for connection in self.ws_connections:
            try:
                connection.send(message)
            except:
                inactive_connections.add(connection)

        # Limpiar conexiones inactivas
        for connection in inactive_connections:
            self.remove_connection(connection)

    def create_notification(self, user_id, type, message, data=None):
        """Crea una nueva notificación"""
        try:
            notification = {
                'userId': user_id,
                'type': type,
                'message': message,
                'data': data,
                'read': False,
                'createdAt': datetime.now()
            }

            result = self.notifications.insert_one(notification)
            notification['_id'] = str(result.inserted_id)

            # Transmitir la notificación
            self.broadcast({
                'type': 'notification',
                'payload': notification
            })

            return notification
        except Exception as e:
            print(f"Error creando notificación: {e}")
            return None

    def mark_as_read(self, notification_id, user_id):
        """Marca una notificación como leída"""
        try:
            result = self.notifications.update_one(
                {'_id': notification_id, 'userId': user_id},
                {'$set': {'read': True}}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error marcando notificación como leída: {e}")
            return False

    def get_user_notifications(self, user_id, limit=50):
        """Obtiene las notificaciones de un usuario"""
        try:
            notifications = list(self.notifications.find(
                {'userId': user_id}
            ).sort('createdAt', -1).limit(limit))
            
            for notif in notifications:
                notif['_id'] = str(notif['_id'])
            
            return notifications
        except Exception as e:
            print(f"Error obteniendo notificaciones: {e}")
            return []

    def get_unread_count(self, user_id):
        """Obtiene el conteo de notificaciones no leídas"""
        try:
            return self.notifications.count_documents({
                'userId': user_id,
                'read': False
            })
        except Exception as e:
            print(f"Error obteniendo conteo de no leídas: {e}")
            return 0