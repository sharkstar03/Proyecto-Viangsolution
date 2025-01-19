# backend/routes/routes.py
from flask import Blueprint
from controllers.cotizaciones_controller import CotizacionesController
from controllers.facturas_controller import FacturasController
from controllers.auth_controller import AuthController
from controllers.payment_controller import PaymentController
from controllers.report_controller import ReportController

# Controladores
cotizaciones_controller = CotizacionesController()
facturas_controller = FacturasController()
auth_controller = AuthController()
payment_controller = PaymentController()
report_controller = ReportController()

# Blueprints
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
cotizaciones_bp = Blueprint('cotizaciones', __name__, url_prefix='/api/cotizaciones')
facturas_bp = Blueprint('facturas', __name__, url_prefix='/api/facturas')
payments_bp = Blueprint('payments', __name__, url_prefix='/api/payments')
reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')

# Rutas de Autenticación
@auth_bp.route('/login', methods=['POST'])
def login():
    return auth_controller.login()

@auth_bp.route('/register', methods=['POST'])
def register():
    return auth_controller.register()

@auth_bp.route('/verify', methods=['GET'])
def verify_token():
    return auth_controller.verify_token()

@auth_bp.route('/change-password', methods=['POST'])
def change_password():
    return auth_controller.change_password()

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    return auth_controller.forgot_password()

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    return auth_controller.reset_password()

# Rutas de Cotizaciones
@cotizaciones_bp.route('/', methods=['GET'])
def get_cotizaciones():
    return cotizaciones_controller.get_cotizaciones()

@cotizaciones_bp.route('/', methods=['POST'])
def create_cotizacion():
    return cotizaciones_controller.create_cotizacion()

@cotizaciones_bp.route('/<cotizacion_id>', methods=['GET'])
def get_cotizacion(cotizacion_id):
    return cotizaciones_controller.get_cotizacion(cotizacion_id)

@cotizaciones_bp.route('/<cotizacion_id>', methods=['PUT'])
def update_cotizacion(cotizacion_id):
    return cotizaciones_controller.update_cotizacion(cotizacion_id)

@cotizaciones_bp.route('/<cotizacion_id>', methods=['DELETE'])
def delete_cotizacion(cotizacion_id):
    return cotizaciones_controller.delete_cotizacion(cotizacion_id)

@cotizaciones_bp.route('/buscar', methods=['GET'])
def search_cotizaciones():
    return cotizaciones_controller.search_cotizaciones()

@cotizaciones_bp.route('/<cotizacion_id>/pdf', methods=['GET'])
def generate_cotizacion_pdf(cotizacion_id):
    return cotizaciones_controller.generate_pdf(cotizacion_id)

# Rutas de Facturas
@facturas_bp.route('/', methods=['GET'])
def get_facturas():
    return facturas_controller.get_facturas()

@facturas_bp.route('/desde-cotizacion/<cotizacion_id>', methods=['POST'])
def crear_desde_cotizacion(cotizacion_id):
    return facturas_controller.crear_desde_cotizacion(cotizacion_id)

@facturas_bp.route('/<factura_id>', methods=['GET'])
def get_factura(factura_id):
    return facturas_controller.get_factura(factura_id)

@facturas_bp.route('/<factura_id>/pago', methods=['POST'])
def registrar_pago(factura_id):
    return facturas_controller.registrar_pago(factura_id)

@facturas_bp.route('/<factura_id>/pdf', methods=['GET'])
def generate_factura_pdf(factura_id):
    return facturas_controller.generate_pdf(factura_id)

@facturas_bp.route('/pendientes', methods=['GET'])
def get_pending_payments():
    return facturas_controller.get_pending_payments()

# Rutas de Pagos
@payments_bp.route('/', methods=['GET'])
def get_payments():
    return payment_controller.get_payments()

@payments_bp.route('/', methods=['POST'])
def create_payment():
    return payment_controller.create_payment()

@payments_bp.route('/<payment_id>/confirm', methods=['POST'])
def confirm_payment(payment_id):
    return payment_controller.confirm_payment(payment_id)

@payments_bp.route('/summary', methods=['GET'])
def get_payment_summary():
    return payment_controller.get_payment_summary()

@payments_bp.route('/stats', methods=['GET'])
def get_payment_stats():
    return payment_controller.get_payment_stats()

# Rutas de Reportes
@reports_bp.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    return report_controller.get_dashboard_data()

@reports_bp.route('/financial', methods=['GET'])
def get_financial_report():
    return report_controller.get_financial_report()

@reports_bp.route('/accounts-receivable', methods=['GET'])
def get_accounts_receivable_report():
    return report_controller.get_accounts_receivable_report()

@reports_bp.route('/sales-analysis', methods=['GET'])
def get_sales_analysis():
    return report_controller.get_sales_analysis()

@reports_bp.route('/export', methods=['GET'])
def export_report():
    return report_controller.export_report()

@reports_bp.route('/customers/<customer_id>', methods=['GET'])
def get_customer_analysis(customer_id):
    return report_controller.get_customer_analysis(customer_id)

# Error handlers
@cotizaciones_bp.errorhandler(404)
@facturas_bp.errorhandler(404)
@payments_bp.errorhandler(404)
def not_found_error(error):
    return {
        "status": "error",
        "message": "Recurso no encontrado"
    }, 404

@cotizaciones_bp.errorhandler(500)
@facturas_bp.errorhandler(500)
@payments_bp.errorhandler(500)
def internal_error(error):
    return {
        "status": "error",
        "message": "Error interno del servidor"
    }, 500