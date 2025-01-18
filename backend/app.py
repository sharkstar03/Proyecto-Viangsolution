from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

# Configuración de la aplicación
app = Flask(__name__)
CORS(app)

# Conexión a MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["viangsolution"]

# Colecciones
cotizaciones_collection = db["cotizaciones"]
facturas_collection = db["facturas"]

# Ruta de prueba
@app.route('/')
def home():
    return jsonify({"mensaje": "Bienvenido al backend de Viangsolution"}), 200

# Rutas para Cotizaciones
@app.route('/api/cotizaciones', methods=['GET'])
def obtener_cotizaciones():
    cotizaciones = list(cotizaciones_collection.find({}, {"_id": 0}))
    return jsonify(cotizaciones), 200

@app.route('/api/cotizaciones', methods=['POST'])
def crear_cotizacion():
    data = request.json
    cotizaciones_collection.insert_one(data)
    return jsonify({"mensaje": "Cotización creada con éxito"}), 201

@app.route('/api/cotizaciones/<int:id>', methods=['DELETE'])
def eliminar_cotizacion(id):
    result = cotizaciones_collection.delete_one({"id": id})
    if result.deleted_count == 0:
        return jsonify({"error": "Cotización no encontrada"}), 404
    return jsonify({"mensaje": "Cotización eliminada"}), 200

# Rutas para Facturas
@app.route('/api/facturas', methods=['GET'])
def obtener_facturas():
    facturas = list(facturas_collection.find({}, {"_id": 0}))
    return jsonify(facturas), 200

@app.route('/api/facturas', methods=['POST'])
def crear_factura():
    data = request.json
    facturas_collection.insert_one(data)
    return jsonify({"mensaje": "Factura creada con éxito"}), 201

@app.route('/api/facturas/<int:id>', methods=['DELETE'])
def eliminar_factura(id):
    result = facturas_collection.delete_one({"id": id})
    if result.deleted_count == 0:
        return jsonify({"error": "Factura no encontrada"}), 404
    return jsonify({"mensaje": "Factura eliminada"}), 200

# Ejecutar la aplicación
if __name__ == '__main__':
    app.run(debug=True)
