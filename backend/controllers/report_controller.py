# backend/controllers/report_controller.py
from flask import jsonify, request, send_file
from models.cotizacion import Cotizacion
from models.factura import Factura
from models.payment import Payment
from models.accounting import Accounting
from services.report_service import ReportService
from utils.auth_utils import requires_auth
from datetime import datetime, timedelta
import pandas as pd
import io

class ReportController:
    def __init__(self):
        self.cotizacion_model = Cotizacion()
        self.factura_model = Factura()
        self.payment_model = Payment()
        self.accounting_model = Accounting()
        self.report_service = ReportService()

    @requires_auth
    def get_dashboard_data(self):
        """Obtiene datos para el dashboard"""
        try:
            # Obtener período de análisis
            period = request.args.get('period', 'month')
            if period == 'month':
                start_date = datetime.now() - timedelta(days=30)
            elif period == 'quarter':
                start_date = datetime.now() - timedelta(days=90)
            elif period == 'year':
                start_date = datetime.now() - timedelta(days=365)
            else:
                start_date = datetime.now() - timedelta(days=30)

            # Obtener estadísticas generales
            cotizaciones_stats = self.cotizacion_model.get_stats()
            facturas_stats = self.factura_model.get_stats()
            payment_stats = self.payment_model.get_payment_stats()

            # Calcular KPIs
            total_ventas = facturas_stats['total_amount']
            total_cobrado = facturas_stats['total_collected']
            tasa_conversion = (facturas_stats['total_count'] / cotizaciones_stats['total_count']) * 100 if cotizaciones_stats['total_count'] > 0 else 0

            # Obtener tendencias
            tendencias = self.report_service.get_trends(start_date)

            return jsonify({
                "status": "success",
                "data": {
                    "kpis": {
                        "total_ventas": total_ventas,
                        "total_cobrado": total_cobrado,
                        "por_cobrar": total_ventas - total_cobrado,
                        "tasa_conversion": tasa_conversion,
                        "ticket_promedio": facturas_stats['average_amount']
                    },
                    "cotizaciones": cotizaciones_stats,
                    "facturas": facturas_stats,
                    "pagos": payment_stats,
                    "tendencias": tendencias
                }
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def get_financial_report(self):
        """Genera reporte financiero"""
        try:
            start_date = request.args.get('start_date')
            end_date = request.args.get('end_date')
            report_type = request.args.get('type', 'general')

            if not start_date or not end_date:
                return jsonify({
                    "status": "error",
                    "message": "Se requieren fechas de inicio y fin"
                }), 400

            start_date = datetime.fromisoformat(start_date)
            end_date = datetime.fromisoformat(end_date)

            if report_type == 'balance':
                data = self.accounting_model.get_balance_sheet(end_date)
            elif report_type == 'income':
                data = self.accounting_model.get_income_statement(start_date, end_date)
            elif report_type == 'cash_flow':
                data = self.accounting_model.get_cash_flow(start_date, end_date)
            else:
                # Reporte general que incluye todo
                data = {
                    'balance': self.accounting_model.get_balance_sheet(end_date),
                    'income': self.accounting_model.get_income_statement(start_date, end_date),
                    'cash_flow': self.accounting_model.get_cash_flow(start_date, end_date)
                }

            return jsonify({
                "status": "success",
                "data": data
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def get_accounts_receivable_report(self):
        """Genera reporte de cuentas por cobrar"""
        try:
            aging = self.accounting_model.get_accounts_receivable_aging()
            return jsonify({
                "status": "success",
                "data": {
                    "aging": aging,
                    "summary": {
                        "total_receivable": sum(period['total'] for period in aging),
                        "total_overdue": sum(period['total'] for period in aging if period['_id'] != '0-30')
                    }
                }
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def get_sales_analysis(self):
        """Genera análisis de ventas"""
        try:
            period = request.args.get('period', 'month')
            group_by = request.args.get('group_by', 'product')

            analysis = self.report_service.analyze_sales(period, group_by)
            return jsonify({
                "status": "success",
                "data": analysis
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def export_report(self):
        """Exporta reportes en diferentes formatos"""
        try:
            report_type = request.args.get('type')
            format = request.args.get('format', 'excel')
            start_date = request.args.get('start_date')
            end_date = request.args.get('end_date')

            if not report_type or not start_date or not end_date:
                return jsonify({
                    "status": "error",
                    "message": "Faltan parámetros requeridos"
                }), 400

            # Obtener datos según el tipo de reporte
            if report_type == 'sales':
                data = self.report_service.get_sales_report(start_date, end_date)
            elif report_type == 'financial':
                data = self.report_service.get_financial_report(start_date, end_date)
            elif report_type == 'receivables':
                data = self.report_service.get_receivables_report(start_date, end_date)
            else:
                return jsonify({
                    "status": "error",
                    "message": "Tipo de reporte no válido"
                }), 400

            # Convertir a DataFrame
            df = pd.DataFrame(data)

            # Exportar según formato
            if format == 'excel':
                output = io.BytesIO()
                with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                    df.to_excel(writer, sheet_name='Reporte', index=False)
                output.seek(0)
                
                return send_file(
                    output,
                    mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    as_attachment=True,
                    download_name=f'reporte_{report_type}_{datetime.now().strftime("%Y%m%d")}.xlsx'
                )
            
            elif format == 'csv':
                output = io.StringIO()
                df.to_csv(output, index=False)
                output.seek(0)
                
                return send_file(
                    io.BytesIO(output.getvalue().encode('utf-8')),
                    mimetype='text/csv',
                    as_attachment=True,
                    download_name=f'reporte_{report_type}_{datetime.now().strftime("%Y%m%d")}.csv'
                )
            
            else:
                return jsonify({
                    "status": "error",
                    "message": "Formato no soportado"
                }), 400

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500

    @requires_auth
    def get_customer_analysis(self, customer_id=None):
        """Análisis de clientes"""
        try:
            if customer_id:
                # Análisis individual del cliente
                analysis = self.report_service.analyze_customer(customer_id)
            else:
                # Análisis general de clientes
                analysis = self.report_service.analyze_customers()

            return jsonify({
                "status": "success",
                "data": analysis
            }), 200

        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500