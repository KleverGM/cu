from rest_framework import serializers
from .models import Show, Reservation

# Los serializers convierten modelos Django a JSON y viceversa para las APIs REST

class ShowSerializer(serializers.ModelSerializer):
    # Serializer para el modelo Show - Convierte funciones de cine a JSON
    class Meta:
        model = Show
        fields = ["id", "movie_title", "room", "price", "available_seats"]  # Campos incluidos en el JSON


class ReservationSerializer(serializers.ModelSerializer):
    # Serializer para el modelo Reservation - Incluye título de película para evitar peticiones adicionales
    show_movie_title = serializers.CharField(source="show.movie_title", read_only=True)  # Campo extra desde ForeignKey (solo lectura)

    class Meta:
        model = Reservation
        fields = ["id", "show", "show_movie_title", "customer_name", "seats", "status", "created_at"]  # Campos incluidos en el JSON