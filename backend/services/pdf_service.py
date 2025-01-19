# backend/services/pdf_service.py
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from models.configuracion import Configuracion
from datetime import datetime
import io

class PDFService:
    def __init__(self):
        self.config = Configuracion()
        self.styles = getSampleStyleSheet()
        
    def generar_cotizacion_pdf(self, cotizacion_data):
        """Genera PDF de una cotización usando ReportLab"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )

        # Obtener configuración
        config = self.config.get_config()
        
        # Lista de elementos para el PDF
        elements = []

        # Estilos
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30
        )
        
        # Título
        elements.append(Paragraph("COTIZACIÓN", title_style))
        elements.append(Paragraph(f"N° {cotizacion_data['numeroCotizacion']}", self.styles['Heading2']))
        elements.append(Spacer(1, 12))

        # Información de la empresa
        elements.append(Paragraph(f"Fecha: {datetime.now().strftime('%d/%m/%Y')}", self.styles['Normal']))
        elements.append(Spacer(1, 12))
        elements.append(Paragraph(f"{config['empresa']['nombre']}", self.styles['Heading3']))
        elements.append(Paragraph(f"RUC: {config['empresa']['ruc']}", self.styles['Normal']))
        elements.append(Paragraph(f"Dirección: {config['empresa']['direccion']}", self.styles['Normal']))
        elements.append(Paragraph(f"Teléfono: {config['empresa']['telefono']}", self.styles['Normal']))
        elements.append(Spacer(1, 20))

        # Información del cliente
        elements.append(Paragraph("DATOS DEL CLIENTE", self.styles['Heading3']))
        elements.append(Paragraph(f"Nombre: {cotizacion_data['nombre']}", self.styles['Normal']))
        if cotizacion_data.get('empresa'):
            elements.append(Paragraph(f"Empresa: {cotizacion_data['empresa']}", self.styles['Normal']))
        elements.append(Paragraph(f"Email: {cotizacion_data['correo']}", self.styles['Normal']))
        elements.append(Paragraph(f"Teléfono: {cotizacion_data['telefono']}", self.styles['Normal']))
        elements.append(Spacer(1, 20))

        # Tabla de items
        table_data = [['Descripción', 'Cantidad', 'Precio Unit.', 'Total']]
        for item in cotizacion_data['items']:
            table_data.append([
                item['descripcion'],
                str(item['cantidad']),
                f"${item['precioUnitario']:.2f}",
                f"${(item['cantidad'] * item['precioUnitario']):.2f}"
            ])

        # Añadir totales
        table_data.extend([
            ['', '', 'Subtotal:', f"${cotizacion_data['subtotal']:.2f}"],
            ['', '', 'ITBMS (7%):', f"${cotizacion_data['itbms']:.2f}"],
            ['', '', 'Total:', f"${cotizacion_data['total']:.2f}"]
        ])

        # Estilo de la tabla
        table_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 12),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ])

        table = Table(table_data)
        table.setStyle(table_style)
        elements.append(table)
        elements.append(Spacer(1, 20))

        # Términos y condiciones
        elements.append(Paragraph("Términos y Condiciones", self.styles['Heading3']))
        for termino in config['cotizacion']['terminos']:
            elements.append(Paragraph(f"• {termino}", self.styles['Normal']))

        # Generar PDF
        doc.build(elements)
        pdf = buffer.getvalue()
        buffer.close()
        
        return pdf

    def generar_factura_pdf(self, factura_data):
        """Genera PDF de una factura usando ReportLab"""
        # Similar a generar_cotizacion_pdf pero con formato de factura
        # ... (implementación similar)
        pass