// ✅ CORREGIDO: API para Shows (funciones de cine) en lugar de ServiceTypes
// ANTES: Manejaba /api/service-types/ con ServiceType (Mongo)
// AHORA: Maneja /api/shows/ con Show (Postgres)
import { http } from "./http";
import type { Show } from "../types/movieCatalog"; // ✅ ANTES: ServiceType
import type { Paginated } from "../types/drf";

// ✅ CORREGIDO: Endpoint de /api/service-types/ a /api/shows/
export async function listShowsApi(): Promise<Paginated<Show> | Show[]> {
  const { data } = await http.get<Paginated<Show> | Show[]>("/api/shows/"); // ✅ ANTES: /api/service-types/
  return data;
}

// ✅ CORREGIDO: Payload para crear Show
// ANTES: Pick<ServiceType, "name"> & Partial<ServiceType>
// AHORA: Todos los campos requeridos de Show
export async function createShowApi(payload: Omit<Show, "id">): Promise<Show> {
  const { data } = await http.post<Show>("/api/shows/", payload); // ✅ ANTES: /api/service-types/
  return data;
}

// ✅ CORREGIDO: ID ahora es number (Postgres) en lugar de string (Mongo)
export async function deleteShowApi(id: number): Promise<void> {
  await http.delete(`/api/shows/${id}/`); // ✅ ANTES: /api/service-types/${id}/
}
