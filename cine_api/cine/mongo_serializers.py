from rest_framework import serializers
from django.db.models import TextChoices
from datetime import datetime

# Serializers para datos que se guardan en MongoDB (sin ModelSerializer porque MongoDB no usa modelos Django)

class EventType(TextChoices):
    # Tipos de eventos que pueden ocurrir en una reservación
    CREATED = "Created", "Created"  # Reservación creada
    CONFIRMED = "Confirmed", "Confirmed"  # Reservación confirmada
    CANCELLED = "Cancelled", "Cancelled"  # Reservación cancelada
    CHECKED_IN = "Checked-In", "Checked-In"  # Cliente hizo check-in

class Source(TextChoices):
    # Origen desde donde se realizó la acción
    WEB = "Web", "web"  # Desde sitio web
    MOBILE = "Mobile", "mobile"  # Desde app móvil
    SYSTEM = "System", "system"  # Acción automática del sistema


class MovieCatalogSerializer(serializers.Serializer):
    # Serializer para catálogo de películas en MongoDB - Almacena info adicional que no se guarda en PostgreSQL
    movie_title = serializers.CharField(max_length=120)  # Título de la película
    genre = serializers.CharField(max_length=50)  # Género (Acción, Drama, Comedia, etc.)
    duration_min = serializers.IntegerField(required=False)  # Duración en minutos (opcional)
    rating = serializers.CharField(max_length=10, required=False)  # Clasificación (G, PG, PG-13, R, etc.) - opcional
    is_active = serializers.BooleanField(default=True, required=False)  # Si la película está activa en cartelera

class ReservationEventSerializer(serializers.Serializer):
    # Serializer para log de eventos de reservaciones en MongoDB - Permite auditoría y trazabilidad
    reservation_id = serializers.IntegerField()  # ID de la reservación en PostgreSQL
    event_type = serializers.ChoiceField(choices=EventType.choices, default=EventType.CREATED)  # Tipo de evento ocurrido
    source = serializers.ChoiceField(choices=Source.choices, default=Source.WEB)  # Origen del evento
    note = serializers.CharField(max_length=120, required=False)  # Nota o comentario adicional (opcional)
    created_at = serializers.DateTimeField(default=datetime.utcnow, required=False)  # Timestamp del evento (se genera automáticamente)