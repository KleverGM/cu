from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from bson.errors import InvalidId
from .mongo import db
from .mongo_serializers import MovieCatalogSerializer

# Vistas para operaciones CRUD en MongoDB - Catálogo de películas

col = db["movie_catalogs"]  # Colección de MongoDB donde se guardan los catálogos de películas

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

@api_view(["GET", "POST"])  # Permite métodos GET (listar) y POST (crear)
@permission_classes([IsAuthenticated])  # Solo usuarios autenticados pueden acceder
def movie_catalogs_list_create(request):
    # Vista para listar todos los catálogos (GET) o crear uno nuevo (POST)
    if request.method == "GET":
        docs = [fix_id(d) for d in col.find()]  # Obtiene todos los documentos y convierte _id a id
        return Response(docs)

    # POST - Crear nuevo catálogo
    serializer = MovieCatalogSerializer(data=request.data)  # Valida datos recibidos
    serializer.is_valid(raise_exception=True)  # Lanza error 400 si los datos son inválidos

    res = col.insert_one(serializer.validated_data)  # Inserta documento en MongoDB
    doc = col.find_one({"_id": res.inserted_id})  # Recupera el documento insertado
    return Response(fix_id(doc), status=status.HTTP_201_CREATED)  # Retorna el documento creado con código 201

@api_view(["GET", "PUT", "PATCH", "DELETE"])  # Permite operaciones sobre un catálogo específico
@permission_classes([IsAuthenticated])  # Solo usuarios autenticados pueden acceder
def movie_catalogs_detail(request, id: str):
    # Vista para obtener (GET), actualizar completo (PUT), actualizar parcial (PATCH) o eliminar (DELETE) un catálogo
    _id = oid_or_none(id)  # Convierte string a ObjectId
    if _id is None:
        return Response({"detail": "id inválido"}, status=status.HTTP_400_BAD_REQUEST)  # Error si el ID no es válido

    if request.method == "GET":
        doc = col.find_one({"_id": _id})  # Busca documento por ID
        if not doc:
            return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))  # Retorna documento encontrado

    if request.method in ["PUT", "PATCH"]:
        # PUT = actualización completa | PATCH = actualización parcial (solo campos enviados)
        serializer = MovieCatalogSerializer(data=request.data, partial=(request.method == "PATCH"))
        serializer.is_valid(raise_exception=True)

        col.update_one({"_id": _id}, {"$set": serializer.validated_data})  # Actualiza documento en MongoDB
        doc = col.find_one({"_id": _id})  # Recupera documento actualizado
        if not doc:
            return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)
        return Response(fix_id(doc))  # Retorna documento actualizado

    # DELETE - Eliminar catálogo
    res = col.delete_one({"_id": _id})  # Elimina documento de MongoDB
    if res.deleted_count == 0:
        return Response({"detail": "No encontrado"}, status=status.HTTP_404_NOT_FOUND)  # Error si no se encontró
    return Response(status=status.HTTP_204_NO_CONTENT)  # Retorna 204 (sin contenido) si se eliminó correctamente