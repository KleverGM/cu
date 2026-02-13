// ✅ CORREGIDO: Tipo ReservationEvent para el proyecto de cine (modelo Mongo)
// ANTES: type VehicleService = { id, vehiculo_id, service_type_id, date, notes, cost }
// AHORA: type ReservationEvent con campos del modelo ReservationEvent de MongoDB
export type ReservationEvent = {
  id: string; // ✅ ANTES: id Mongo | AHORA: sigue siendo _id de Mongo
  reservation_id: number; // ✅ ANTES: vehiculo_id (Postgres) | AHORA: reservation_id (FK a Reservation)
  event_type: string; // ✅ AGREGADO: "created", "modified", "cancelled"
  source?: string; // ✅ AGREGADO: "web", "mobile", "admin"
  note?: string; // ✅ ANTES: notes | AHORA: note (opcional)
  created_at?: string; // ✅ ANTES: date | AHORA: created_at (asignado por backend)
};
