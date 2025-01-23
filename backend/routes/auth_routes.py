from flask import Blueprint
from controllers.auth_controller import AuthController

auth_bp = Blueprint('auth', __name__)
auth_controller = AuthController()

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    return auth_controller.register()

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    return auth_controller.login()
