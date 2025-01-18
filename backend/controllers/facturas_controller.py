from flask import jsonify, request
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["viangsolution"]
facturas_collection = db["facturas"]

def obtener_facturas():
    # Parámetros de consulta
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    client_name = request.args.get("client")

    query = {}
    if client_name:
        query["client"] = {"$regex": client_name, "$options": "i"}

    facturas = list(
        facturas_collection.find(query, {"_id": 0})
        .skip((page - 1) * limit)
        .limit(limit)
    )
    total = facturas_collection.count_documents(query)

    return jsonify({"total": total, "page": page, "facturas": facturas}), 200
