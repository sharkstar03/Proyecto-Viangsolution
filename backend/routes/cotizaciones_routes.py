from flask import Blueprint, request, jsonify, send_file
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO

cotizacion_bp = Blueprint("cotizacion", __name__)

@cotizacion_bp.route('/api/generar-cotizacion', methods=['POST'])
def generar_cotizacion():
    data = request.json
    nombre_cliente = data.get("nombre_cliente", "Cliente")
    numero_cotizacion = data.get("numero_cotizacion", "0001")
    fecha = data.get("fecha", "2025-01-01")
    ruc = data.get("ruc", "")
    dv = data.get("dv", "")
    productos = data.get("productos", [])
    subtotal = sum([p["precio_unitario"] * p["cantidad"] for p in productos])
    itbms = subtotal * 0.07
    total = subtotal + itbms

    # Crear el PDF en memoria
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)

    # Título
    c.setFont("Helvetica-Bold", 20)
    c.drawString(100, 750, f"Cotización N° {numero_cotizacion}")

    # Información del cliente
    c.setFont("Helvetica", 12)
    c.drawString(50, 700, f"Nombre: {nombre_cliente}")
    c.drawString(50, 680, f"RUC: {ruc} DV: {dv}" if ruc and dv else "")
    c.drawString(50, 660, f"Fecha: {fecha}")

    # Tabla de productos
    y = 620
    c.drawString(50, y, "Descripción")
    c.drawString(250, y, "Precio Unitario")
    c.drawString(350, y, "Cantidad")
    c.drawString(450, y, "Total")
    y -= 20
    for producto in productos:
        c.drawString(50, y, producto["descripcion"])
        c.drawString(250, y, f"${producto['precio_unitario']:.2f}")
        c.drawString(350, y, str(producto["cantidad"]))
        c.drawString(450, y, f"${producto['precio_unitario'] * producto['cantidad']:.2f}")
        y -= 20

    # Subtotales
    y -= 20
    c.drawString(350, y, "Subtotal:")
    c.drawString(450, y, f"${subtotal:.2f}")
    y -= 20
    c.drawString(350, y, "ITBMS (7%):")
    c.drawString(450, y, f"${itbms:.2f}")
    y -= 20
    c.drawString(350, y, "Total:")
    c.drawString(450, y, f"${total:.2f}")

    # Finalizar PDF
    c.save()

    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name=f"{nombre_cliente}_{numero_cotizacion}.pdf", mimetype="application/pdf")
