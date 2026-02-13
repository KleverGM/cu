from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Show, Reservation
from .serializers import ShowSerializer, ReservationSerializer
from .permissions import IsAdminOrReadOnly

# ViewSets proporcionan automáticamente operaciones CRUD (Create, Read, Update, Delete) para los modelos

class ShowViewSet(viewsets.ModelViewSet):
    # ViewSet para gestionar funciones de cine - Permite listar, crear, actualizar y eliminar shows
    queryset = Show.objects.all().order_by("id")  # Obtiene todos los shows ordenados por ID ascendente
    serializer_class = ShowSerializer  # Usa ShowSerializer para convertir entre JSON y modelos
    permission_classes = [IsAdminOrReadOnly]  # Solo admins pueden crear/modificar/eliminar, otros solo pueden leer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]  # Habilita filtrado, búsqueda y ordenamiento
    search_fields = ["movie_title", "room"]  # Permite buscar por título de película o sala (ej: ?search=Avatar)
    ordering_fields = ["id", "movie_title", "room", "price", "available_seats"]  # Campos por los que se puede ordenar (ej: ?ordering=-price)


class ReservationViewSet(viewsets.ModelViewSet):
    # ViewSet para gestionar reservaciones - Permite listar, crear, actualizar y eliminar reservaciones
    queryset = Reservation.objects.select_related("show").all().order_by("-id")  # select_related optimiza queries al traer show relacionado | orden descendente (más recientes primero)
    serializer_class = ReservationSerializer  # Usa ReservationSerializer para convertir entre JSON y modelos
    permission_classes = [IsAdminOrReadOnly]  # Permisos por defecto (se sobreescribe en get_permissions para 'list')
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]  # Habilita filtrado, búsqueda y ordenamiento
    filterset_fields = ["show"]  # Permite filtrar por función específica (ej: ?show=5)
    search_fields = ["customer_name", "status", "show__movie_title"]  # Permite buscar por nombre, estado o película (__ accede a campos relacionados)
    ordering_fields = ["id", "show", "customer_name", "status", "seats", "created_at"]  # Campos disponibles para ordenar resultados

    def get_permissions(self):
        # Sobreescribe permisos: permite a cualquiera listar reservaciones (GET), pero solo admins pueden crear/modificar/eliminar
        if self.action == "list":  # Si la acción es listar (GET /reservations/)
            return [AllowAny()]  # Permite acceso sin autenticación
        return super().get_permissions()  # Para otras acciones (create, update, delete) usa IsAdminOrReadOnly