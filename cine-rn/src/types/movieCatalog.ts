// ✅ CORREGIDO: Tipo Show para el proyecto de cine (modelo Postgres)
// ANTES: type ServiceType = { id, name, description, base_price, is_active }
// AHORA: type Show con campos del modelo Show de Django (funciones de cine)
export type Show = {
  id: number; // ✅ ANTES: string (Mongo) | AHORA: number (Postgres)
  movie_title: string; // ✅ ANTES: name | AHORA: movie_title
  room: string; // ✅ AGREGADO: sala de cine
  price: number; // ✅ ANTES: base_price? | AHORA: price (requerido)
  available_seats: number; // ✅ AGREGADO: asientos disponibles
};
