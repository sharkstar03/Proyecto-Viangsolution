# backend/services/report_service.py
from datetime import datetime, timedelta
from models.cotizacion import Cotizacion
from models.factura import Factura
from models.payment import Payment
import pandas as pd

class ReportService:
    def __init__(self):
        self.cotizacion_model = Cotizacion()
        self.factura_model = Factura()
        self.payment_model = Payment()

    def get_trends(self, start_date):
        """Obtiene tendencias de ventas y cotizaciones"""
        try:
            end_date = datetime.now()
            
            # Obtener datos
            cotizaciones = self.cotizacion_model.get_by_date_range(start_date, end_date)
            facturas = self.factura_model.get_by_date_range(start_date, end_date)
            
            # Convertir a DataFrame para análisis
            df_cotizaciones = pd.DataFrame(cotizaciones)
            df_facturas = pd.DataFrame(facturas)
            
            # Análisis por día
            daily_trends = []
            current_date = start_date
            while current_date <= end_date:
                next_date = current_date + timedelta(days=1)
                daily_data = {
                    'fecha': current_date.strftime('%Y-%m-%d'),
                    'cotizaciones': len(df_cotizaciones[
                        (df_cotizaciones['createdAt'] >= current_date) & 
                        (df_cotizaciones['createdAt'] < next_date)
                    ]),
                    'facturas': len(df_facturas[
                        (df_facturas['createdAt'] >= current_date) & 
                        (df_facturas['createdAt'] < next_date)
                    ]),
                    'monto_cotizaciones': float(df_cotizaciones[
                        (df_cotizaciones['createdAt'] >= current_date) & 
                        (df_cotizaciones['createdAt'] < next_date)
                    ]['total'].sum()),
                    'monto_facturas': float(df_facturas[
                        (df_facturas['createdAt'] >= current_date) & 
                        (df_facturas['createdAt'] < next_date)
                    ]['total'].sum())
                }
                daily_trends.append(daily_data)
                current_date = next_date

            return daily_trends

        except Exception as e:
            print(f"Error obteniendo tendencias: {e}")
            return []

    def analyze_sales(self, period, group_by):
        """Analiza ventas por período y agrupación"""
        try:
            # Determinar fechas basado en período
            end_date = datetime.now()
            if period == 'month':
                start_date = end_date - timedelta(days=30)
            elif period == 'quarter':
                start_date = end_date - timedelta(days=90)
            elif period == 'year':
                start_date = end_date - timedelta(days=365)
            else:
                start_date = end_date - timedelta(days=30)

            # Obtener facturas del período
            facturas = self.factura_model.get_by_date_range(start_date, end_date)
            df_facturas = pd.DataFrame(facturas)

            # Agrupar según criterio
            if group_by == 'product':
                # Descomponer items de facturas
                items = []
                for factura in facturas:
                    for item in factura['items']:
                        item['fecha'] = factura['createdAt']
                        items.append(item)
                
                df_items = pd.DataFrame(items)
                analysis = df_items.groupby('descripcion').agg({
                    'cantidad': 'sum',
                    'precioUnitario': 'mean',
                    'total': 'sum'
                }).reset_index()
                
            elif group_by == 'client':
                analysis = df_facturas.groupby('cliente.nombre').agg({
                    'total': 'sum',
                    'numeroFactura': 'count'
                }).reset_index()
                
            else:  # group_by == 'date'
                analysis = df_facturas.groupby(
                    df_facturas['createdAt'].dt.strftime('%Y-%m-%d')
                ).agg({
                    'total': 'sum',
                    'numeroFactura': 'count'
                }).reset_index()

            return analysis.to_dict('records')

        except Exception as e:
            print(f"Error analizando ventas: {e}")
            return []

    def get_financial_report(self, start_date, end_date):
        """Genera reporte financiero"""
        try:
            # Obtener datos del período
            facturas = self.factura_model.get_by_date_range(start_date, end_date)
            pagos = self.payment_model.get_by_date_range(start_date, end_date)
            
            # Calcular métricas
            total_facturado = sum(f['total'] for f in facturas)
            total_cobrado = sum(p['monto'] for p in pagos if p['estado'] == 'confirmado')
            total_pendiente = total_facturado - total_cobrado
            
            # Análisis por método de pago
            pagos_por_metodo = {}
            for pago in pagos:
                metodo = pago['metodoPago']
                if metodo not in pagos_por_metodo:
                    pagos_por_metodo[metodo] = 0
                pagos_por_metodo[metodo] += pago['monto']

            return {
                'periodo': {
                    'inicio': start_date.strftime('%Y-%m-%d'),
                    'fin': end_date.strftime('%Y-%m-%d')
                },
                'totales': {
                    'facturado': total_facturado,
                    'cobrado': total_cobrado,
                    'pendiente': total_pendiente
                },
                'facturas': {
                    'cantidad': len(facturas),
                    'promedio': total_facturado / len(facturas) if facturas else 0
                },
                'pagos': {
                    'cantidad': len(pagos),
                    'por_metodo': pagos_por_metodo
                }
            }

        except Exception as e:
            print(f"Error generando reporte financiero: {e}")
            return None

    def analyze_customer(self, customer_id):
        """Analiza el comportamiento de un cliente específico"""
        try:
            # Obtener todas las facturas del cliente
            facturas = self.factura_model.get_by_client(customer_id)
            
            if not facturas:
                return None

            # Convertir a DataFrame
            df_facturas = pd.DataFrame(facturas)
            
            # Calcular métricas
            total_compras = float(df_facturas['total'].sum())
            cantidad_compras = len(facturas)
            promedio_compra = total_compras / cantidad_compras if cantidad_compras > 0 else 0
            
            # Productos más comprados
            items = []
            for factura in facturas:
                for item in factura['items']:
                    items.append(item)
            
            df_items = pd.DataFrame(items)
            productos_frecuentes = df_items.groupby('descripcion').agg({
                'cantidad': 'sum',
                'total': 'sum'
            }).reset_index().to_dict('records')

            return {
                'metricas': {
                    'total_compras': total_compras,
                    'cantidad_compras': cantidad_compras,
                    'promedio_compra': promedio_compra
                },
                'productos_frecuentes': productos_frecuentes,
                'historial': [{
                    'fecha': f['createdAt'],
                    'numero': f['numeroFactura'],
                    'total': f['total'],
                    'estado': f['status']
                } for f in facturas]
            }

        except Exception as e:
            print(f"Error analizando cliente: {e}")
            return None

    def get_receivables_report(self, start_date, end_date):
        """Genera reporte de cuentas por cobrar"""
        try:
            facturas = self.factura_model.get_all()
            
            # Filtrar facturas pendientes
            facturas_pendientes = []
            for factura in facturas:
                if factura['status'] != 'pagada':
                    dias_vencido = (datetime.now() - factura['createdAt']).days
                    factura['dias_vencido'] = dias_vencido
                    facturas_pendientes.append(factura)

            # Agrupar por antigüedad
            por_antiguedad = {
                '0-30': [],
                '31-60': [],
                '61-90': [],
                '90+': []
            }

            for factura in facturas_pendientes:
                if factura['dias_vencido'] <= 30:
                    por_antiguedad['0-30'].append(factura)
                elif factura['dias_vencido'] <= 60:
                    por_antiguedad['31-60'].append(factura)
                elif factura['dias_vencido'] <= 90:
                    por_antiguedad['61-90'].append(factura)
                else:
                    por_antiguedad['90+'].append(factura)

            return {
                'resumen': {
                    'total_pendiente': sum(f['total'] for f in facturas_pendientes),
                    'cantidad_facturas': len(facturas_pendientes)
                },
                'por_antiguedad': {
                    periodo: {
                        'cantidad': len(facturas),
                        'total': sum(f['total'] for f in facturas)
                    }
                    for periodo, facturas in por_antiguedad.items()
                },
                'detalle': facturas_pendientes
            }

        except Exception as e:
            print(f"Error generando reporte de cuentas por cobrar: {e}")
            return None