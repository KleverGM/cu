from django.db import models

# null=True/False → Afecta la BASE DE DATOS | blank=True/False → Afecta VALIDACIÓN DE FORMULARIOS | default="valor" → VALOR AUTOMÁTICO

class Show(models.Model):
    # Modelo que representa una función de cine con información sobre películas, salas, precios y disponibilidad
    movie_title = models.CharField(max_length=120, unique=True, null=False)  # Título de la película (único)
    room = models.CharField(max_length=20, null=False)  # Sala donde se proyecta (ej: "Sala 1", "VIP-A")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=False)  # Precio de la entrada
    available_seats = models.IntegerField(null=False, blank=False)  # Asientos disponibles para la función

    def __str__(self):
        return self.movie_title


class Status(models.TextChoices):
    # Enumeración de estados posibles para una reservación
    RESERVED = "Reserved", "reserved"  # Reservación pendiente
    CONFIRMED = "Confirmed", "confirmed"  # Reservación confirmada
    CANCELLED = "Cancelled", "cancelled"  # Reservación cancelada


class Reservation(models.Model):
    # Modelo que representa una reservación de asientos para una función de cine
    show = models.ForeignKey(Show, on_delete=models.PROTECT, related_name="reservations")  # Función reservada (PROTECT: no se puede eliminar Show con reservaciones)
    customer_name = models.CharField(max_length=120, null=False)  # Nombre del cliente
    seats = models.IntegerField(null=False, blank=False)  # Cantidad de asientos reservados
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.RESERVED, null=False)  # Estado de la reservación
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha y hora de creación (automática)

    def __str__(self):
        return f"{self.show.movie_title} - {self.customer_name} ({self.seats} asientos)"  