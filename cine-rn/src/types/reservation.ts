// ✅ CORREGIDO: Tipo Reservation para el proyecto de cine (modelo Postgres)
// ANTES: type Vehiculo = { id, placa, modelo, anio, color }
// AHORA: type Reservation con campos del modelo Reservation de Django
export type Reservation = {
  id: number;
  show: number; // ✅ AGREGADO: FK a Show (función de cine)
  show_movie_title?: string; // ✅ AGREGADO: Campo extra del serializer
  customer_name: string; // ✅ AGREGADO: nombre del cliente
  seats: number; // ✅ AGREGADO: cantidad de asientos reservados
  status: string; // ✅ AGREGADO: Reserved, Confirmed, Cancelled
  created_at?: string; // ✅ AGREGADO: fecha de creación
};
