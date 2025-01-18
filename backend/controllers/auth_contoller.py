from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from models.user_model import User
import jwt
import datetime
import os

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Buscar el usuario en la base de datos
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Crear un token JWT
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, os.getenv('JWT_SECRET'), algorithm='HS256')

    return jsonify({'message': 'Login successful', 'token': token}), 200
