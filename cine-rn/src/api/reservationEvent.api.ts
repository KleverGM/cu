// ✅ CORREGIDO: API para ReservationEvents (Mongo) en lugar de VehicleServices
// ANTES: Manejaba /api/vehicle-services/ con VehicleService (vehiculo_id + service_type_id)
// AHORA: Maneja /api/reservation-events/ con ReservationEvent (reservation_id + event_type)
import { http } from "./http";
import type { ReservationEvent } from "../types/reservationEvent"; // ✅ ANTES: VehicleService
import type { Paginated } from "../types/drf";

// ✅ CORREGIDO: Payload para crear ReservationEvent
// ANTES: { vehiculo_id, service_type_id, notes?, cost? }
// AHORA: { reservation_id, event_type, source?, note? }
export type ReservationEventCreatePayload = {
  reservation_id: number;
  event_type: string; // "created", "modified", "cancelled"
  source?: string; // "web", "mobile", "admin"
  note?: string;
};

// ✅ CORREGIDO: Endpoint de /api/vehicle-services/ a /api/reservation-events/
export async function listReservationEventsApi(): Promise<
  Paginated<ReservationEvent> | ReservationEvent[]
> {
  const { data } = await http.get<
    Paginated<ReservationEvent> | ReservationEvent[]
  >("/api/reservation-events/"); // ✅ ANTES: /api/vehicle-services/
  return data;
}

export async function createReservationEventApi(
  payload: ReservationEventCreatePayload,
): Promise<ReservationEvent> {
  const { data } = await http.post<ReservationEvent>(
    "/api/reservation-events/", // ✅ ANTES: /api/vehicle-services/
    payload,
  );
  return data;
}

export async function deleteReservationEventApi(id: string): Promise<void> {
  await http.delete(`/api/reservation-events/${id}/`); // ✅ ANTES: /api/vehicle-services/${id}/
}
