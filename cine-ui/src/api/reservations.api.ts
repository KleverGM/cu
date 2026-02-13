// ✅ CORREGIDO: Cambiado de Vehiculo a Reservation para el proyecto de cine
// ANTES: Este archivo se llamaba vehiculos.api.ts y manejaba el modelo Vehiculo
// AHORA: Maneja el modelo Reservation del archivo cine/models.py
import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// ✅ CORREGIDO: Tipo Reservation según modelo Django en cine/models.py
// ANTES: type Vehiculo = { id, marca, modelo, anio, placa, color, marca_nombre }
// AHORA: type Reservation con campos del modelo Reservation de Django
export type Reservation = {
  id: number;
  show: number; // ✅ ANTES: marca (FK) | AHORA: show (FK a Show/función)
  show_movie_title?: string; // ✅ ANTES: marca_nombre | AHORA: show_movie_title
  customer_name: string; // ✅ ANTES: modelo | AHORA: customer_name (nombre del cliente)
  seats: number; // ✅ ANTES: anio | AHORA: seats (cantidad de asientos)
  status: string; // ✅ ANTES: placa | AHORA: status (Reserved, Confirmed, Cancelled)
  created_at?: string; // ✅ ANTES: color | AHORA: created_at (fecha de creación)
};

// ✅ CORREGIDO: Endpoints de /api/vehiculos/ a /api/reservations/
export async function listReservationsPublicApi() {
  const { data } = await http.get<Paginated<Reservation>>("/api/reservations/"); // ✅ ANTES: /api/vehiculos/
  return data; // { ... , results: [] }
}

export async function listReservationsAdminApi() {
  const { data } = await http.get<Paginated<Reservation>>("/api/reservations/"); // ✅ ANTES: /api/vehiculos/
  return data;
}

export async function createReservationApi(
  payload: Omit<Reservation, "id" | "created_at" | "show_movie_title">,
) {
  const { data } = await http.post<Reservation>("/api/reservations/", payload); // ✅ ANTES: /api/vehiculos/
  return data;
}

export async function updateReservationApi(
  id: number,
  payload: Partial<Reservation>,
) {
  const { data } = await http.put<Reservation>(
    `/api/reservations/${id}/`, // ✅ ANTES: /api/vehiculos/${id}/
    payload,
  );
  return data;
}

export async function deleteReservationApi(id: number) {
  await http.delete(`/api/reservations/${id}/`); // ✅ ANTES: /api/vehiculos/${id}/
}
