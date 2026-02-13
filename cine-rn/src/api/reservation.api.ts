// ✅ CORREGIDO: API para Reservations en lugar de Vehiculos
// ANTES: Manejaba /api/vehiculos/ con Vehiculo
// AHORA: Maneja /api/reservations/ con Reservation
import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { Reservation } from "../types/reservation"; // ✅ ANTES: Vehiculo

// ✅ CORREGIDO: Endpoint de /api/vehiculos/ a /api/reservations/
export async function listReservationsApi(): Promise<
  Paginated<Reservation> | Reservation[]
> {
  const { data } = await http.get<Paginated<Reservation> | Reservation[]>(
    "/api/reservations/", // ✅ ANTES: /api/vehiculos/
  );
  return data;
}
