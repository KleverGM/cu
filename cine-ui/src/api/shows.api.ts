// ✅ CORREGIDO: Cambiado de Marca a Show para el proyecto de cine
// ANTES: Este archivo se llamaba marcas.api.ts y manejaba el modelo Marca
// AHORA: Maneja el modelo Show (funciones de cine) del archivo cine/models.py
import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// ✅ CORREGIDO: Tipo Show según modelo Django en cine/models.py
// ANTES: type Marca = { id, nombre }
// AHORA: type Show con campos del modelo Show de Django
export type Show = {
  id: number;
  movie_title: string; // ✅ ANTES: nombre | AHORA: movie_title (título de la película)
  room: string; // ✅ AGREGADO: sala de cine (ej: "Sala 1", "VIP-A")
  price: number; // ✅ AGREGADO: precio de la función
  available_seats: number; // ✅ AGREGADO: asientos disponibles
};

// ✅ CORREGIDO: Endpoint de /api/marcas/ a /api/shows/
export async function listShowsApi() {
  const { data } = await http.get<Paginated<Show>>("/api/shows/"); // ✅ ANTES: /api/marcas/
  return data; // { count, next, previous, results }
}

export async function createShowApi(payload: Omit<Show, "id">) {
  const { data } = await http.post<Show>("/api/shows/", payload); // ✅ ANTES: /api/marcas/
  return data;
}

export async function updateShowApi(id: number, payload: Partial<Show>) {
  const { data } = await http.put<Show>(`/api/shows/${id}/`, payload); // ✅ ANTES: /api/marcas/${id}/
  return data;
}

export async function deleteShowApi(id: number) {
  await http.delete(`/api/shows/${id}/`); // ✅ ANTES: /api/marcas/${id}/
}
