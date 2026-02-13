from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from bson.errors import InvalidId
from .mongo import db
from .mongo_serializers import ReservationEventSerializer

# Vistas para operaciones CRUD en MongoDB - Log de eventos de reservaciones (auditoría)

col = db["reservation_events"]  # Colección de MongoDB donde se guardan los eventos de reservaciones

def fix_id(doc):
    # Convierte _id de MongoDB (ObjectId) a string "id" para JSON - MongoDB usa _id pero APIs REST usan id
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

def oid_or_none(id_str: str):
    # Intenta convertir string a ObjectId de MongoDB - retorna None si el formato es inválido
    try:
        return ObjectId(id_str)
    except InvalidId:
        return None

@api_view(["GET", "POST"])  # Permite métodos GET (listar eventos) y POST (registrar nuevo evento)
@permission_classes([IsAuthenticated])  # Solo usuarios autenticados pueden acceder
def reservation_events_list_create(request):
    # Vista para listar todos los eventos (GET) o registrar uno nuevo (POST)
    if request.method == "GET":
        docs = [fix_id(d) for d in col.find()]  # Obtiene todos los eventos y convierte _id a id
        return Response(docs)

    # POST - Registrar nuevo evento (Created, Confirmed, Cancelled, Checked-In)
    serializer = ReservationEventSerializer(data=request.data)  # Valida datos recibidos
    serializer.is_valid(raise_exception=True)  # Lanza error 400 si los datos son inválidos

    res = col.insert_one(serializer.validated_data)  # Inserta evento en MongoDB (created_at se agrega automáticamente por el serializer)
    doc = col.find_one({"_id": res.inserted_id})  # Recupera el evento insertado
    return Response(fix_id(doc), status=status.HTTP_201_CREATED)  # Retorna el evento creado con código 201

@api_view(["GET", "PUT", "PATCH", "DELETE"])  # Permite operaciones sobre un evento específico
@permission_classes([IsAuthenticated])  # Solo usuarios autenticados pueden acceder
def reservation_events_detail(request, id: str):
    # Vista para obtener (GET), actualizar completo (PUT), actualizar parcial (PATCH) o eliminar (DELETE) un evento
    _id = oid_or_none(id)  # Convierte string a ObjectId
    if _id is None:
        return Response({"detail": "id inválido"}, status=status.HTTP_400_BAD_REQUEST)  # Error si el ID no es válido

    if request.method == "GET":
        doc = col.find_one({"_id": _id})  # Busca evento por ID
        if not doc:
            return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))  # Retorna evento encontrado

    if request.method in ["PUT", "PATCH"]:
        # PUT = actualización completa | PATCH = actualización parcial (solo campos enviados)
        serializer = ReservationEventSerializer(data=request.data, partial=(request.method == "PATCH"))
        serializer.is_valid(raise_exception=True)

        col.update_one({"_id": _id}, {"$set": serializer.validated_data})  # Actualiza evento en MongoDB
        doc = col.find_one({"_id": _id})  # Recupera evento actualizado
        if not doc:
            return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))  # Retorna evento actualizado

    # DELETE - Eliminar evento (útil para corregir logs erróneos)
    res = col.delete_one({"_id": _id})  # Elimina evento de MongoDB
    if res.deleted_count == 0:
        return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)  # Error si no se encontró
    return Response(status=status.HTTP_204_NO_CONTENT)  # Retorna 204 (sin contenido) si se eliminó correctamente