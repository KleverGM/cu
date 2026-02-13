# Guía para usar cine-rn como plantilla en otros proyectos

Esta guía explica cómo reutilizar el proyecto **cine-rn** (React Native + Expo) como plantilla para futuros proyectos que necesiten autenticación JWT con Django y gestión de datos mixtos (Postgres + MongoDB).

---

## 📋 Resumen del Proyecto Actual

**Proyecto**: Sistema de Reservaciones de Cine (React Native)

- **Frontend**: React Native + Expo + TypeScript + React Navigation
- **Backend**: Django REST Framework + JWT
- **Bases de datos**:
  - **Postgres**: Shows (funciones de cine), Reservations (reservaciones)
  - **MongoDB**: ReservationEvents (eventos de auditoría)

**Flujo**:

1. Login con JWT → Guarda tokens en `global`
2. HomeScreen → Navega a MovieCatalog o ReservationEvent
3. MovieCatalogScreen → CRUD de Shows (Postgres)
4. ReservationEventScreen → CRUD de ReservationEvents con 2 selects (Reservation + EventType)

---

## 🔧 Archivos que debes MODIFICAR para adaptar a tu proyecto

### 1. **src/config.ts**

```typescript
// Cambiar la URL base del backend
export const API_BASE_URL = "http://10.0.2.2:8000"; // Android Emulator
// Para dispositivo físico, usa tu IP local: "http://192.168.1.X:8000"
// Para iOS Simulator: "http://localhost:8000"
```

### 2. **package.json**

```json
{
  "name": "cine-rn", // ✅ Cambiar nombre del proyecto
  "version": "1.0.0"
}
```

### 3. **app.json**

```json
{
  "expo": {
    "name": "cine-rn", // ✅ Cambiar nombre de la app
    "slug": "cine-rn", // ✅ Cambiar slug
    "description": "App móvil para gestión de reservaciones de cine" // ✅ Cambiar descripción
  }
}
```

### 4. **Tipos en src/types/**

#### **Modelo Postgres Principal** (ej: `movieCatalog.ts` → `tuModelo.ts`)

```typescript
// ANTES (cine-rn):
export type Show = {
  id: number;
  movie_title: string;
  room: string;
  price: number;
  available_seats: number;
};

// DESPUÉS (tu proyecto):
export type TuModelo = {
  id: number;
  campo1: string;
  campo2: number;
  // ... tus campos
};
```

#### **Modelo de Relación** (ej: `reservation.ts` → `tuRelacion.ts`)

```typescript
// ANTES (cine-rn):
export type Reservation = {
  id: number;
  show: number; // FK a Show
  show_movie_title?: string;
  customer_name: string;
  seats: number;
  status: string;
  created_at?: string;
};

// DESPUÉS (tu proyecto):
export type TuRelacion = {
  id: number;
  tu_modelo_id: number; // FK a TuModelo
  tu_modelo_campo?: string; // Campo extra del serializer
  // ... tus campos
};
```

#### **Modelo MongoDB** (ej: `reservationEvent.ts` → `tuEventoMongo.ts`)

```typescript
// ANTES (cine-rn):
export type ReservationEvent = {
  id: string; // MongoDB _id
  reservation_id: number; // FK a Reservation (Postgres)
  event_type: string;
  source?: string;
  note?: string;
  created_at?: string;
};

// DESPUÉS (tu proyecto):
export type TuEventoMongo = {
  id: string; // MongoDB _id
  tu_relacion_id: number; // FK a tu modelo Postgres
  // ... tus campos
};
```

### 5. **APIs en src/api/**

#### **API Principal** (ej: `movieCatalog.api.ts` → `tuModelo.api.ts`)

```typescript
// ANTES:
import type { Show } from "../types/movieCatalog";

export async function listShowsApi(): Promise<Paginated<Show> | Show[]> {
  const { data } = await http.get<Paginated<Show> | Show[]>("/api/shows/");
  return data;
}

export async function createShowApi(payload: Omit<Show, "id">): Promise<Show> {
  const { data } = await http.post<Show>("/api/shows/", payload);
  return data;
}

export async function deleteShowApi(id: number): Promise<void> {
  await http.delete(`/api/shows/${id}/`);
}

// DESPUÉS:
import type { TuModelo } from "../types/tuModelo";

export async function listTuModeloApi(): Promise<
  Paginated<TuModelo> | TuModelo[]
> {
  const { data } = await http.get<Paginated<TuModelo> | TuModelo[]>(
    "/api/tu-endpoint/",
  );
  return data;
}

export async function createTuModeloApi(
  payload: Omit<TuModelo, "id">,
): Promise<TuModelo> {
  const { data } = await http.post<TuModelo>("/api/tu-endpoint/", payload);
  return data;
}

export async function deleteTuModeloApi(id: number): Promise<void> {
  await http.delete(`/api/tu-endpoint/${id}/`);
}
```

#### **API de Relación** (ej: `reservation.api.ts` → `tuRelacion.api.ts`)

```typescript
// ANTES:
export async function listReservationsApi(): Promise<
  Paginated<Reservation> | Reservation[]
> {
  const { data } = await http.get<Paginated<Reservation> | Reservation[]>(
    "/api/reservations/",
  );
  return data;
}

// DESPUÉS:
export async function listTuRelacionApi(): Promise<
  Paginated<TuRelacion> | TuRelacion[]
> {
  const { data } = await http.get<Paginated<TuRelacion> | TuRelacion[]>(
    "/api/tu-relacion/",
  );
  return data;
}
```

#### **API MongoDB** (ej: `reservationEvent.api.ts` → `tuEventoMongo.api.ts`)

```typescript
// ANTES:
export type ReservationEventCreatePayload = {
  reservation_id: number;
  event_type: string;
  source?: string;
  note?: string;
};

export async function createReservationEventApi(
  payload: ReservationEventCreatePayload,
): Promise<ReservationEvent> {
  const { data } = await http.post<ReservationEvent>(
    "/api/reservation-events/",
    payload,
  );
  return data;
}

// DESPUÉS:
export type TuEventoMongoCreatePayload = {
  tu_relacion_id: number;
  // ... tus campos
};

export async function createTuEventoMongoApi(
  payload: TuEventoMongoCreatePayload,
): Promise<TuEventoMongo> {
  const { data } = await http.post<TuEventoMongo>(
    "/api/tu-evento-mongo/",
    payload,
  );
  return data;
}
```

### 6. **Screens en src/screens/**

#### **Screen Principal** (ej: `MovieCatalogScreen.tsx` → `TuModeloScreen.tsx`)

- Cambiar nombres de estados: `movieTitle, room, price, available_seats` → tus campos
- Actualizar labels de `TextInput`
- Actualizar validaciones
- Cambiar imports de API: `listShowsApi` → `listTuModeloApi`
- Actualizar `FlatList` para mostrar tus campos

#### **Screen con Selects** (ej: `ReservationEventScreen.tsx` → `TuEventoMongoScreen.tsx`)

- Cambiar estados de selects: `selectedReservationId, selectedEventType` → tus selects
- Actualizar `Picker` con tus datos
- Cambiar imports de API
- Actualizar payload de creación

#### **HomeScreen**

```tsx
// ANTES:
<Pressable onPress={() => navigation.navigate("MovieCatalog")} style={styles.btn}>
  <Text style={styles.btnText}>Catálogo de Funciones (list/create/delete)</Text>
</Pressable>

// DESPUÉS:
<Pressable onPress={() => navigation.navigate("TuModelo")} style={styles.btn}>
  <Text style={styles.btnText}>Gestión de Tu Modelo (list/create/delete)</Text>
</Pressable>
```

### 7. **App.tsx (Navegación)**

```tsx
// ANTES:
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  MovieCatalog: undefined;
  ReservationEvent: undefined;
};

import MovieCatalogScreen from "./src/screens/MovieCatalogScreen";
import ReservationEventScreen from "./src/screens/ReservationEventScreen";

<Stack.Screen name="MovieCatalog" component={MovieCatalogScreen} options={{ title: "Catálogo de Funciones" }} />
<Stack.Screen name="ReservationEvent" component={ReservationEventScreen} options={{ title: "Eventos de Reservación" }} />

// DESPUÉS:
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  TuModelo: undefined;
  TuEventoMongo: undefined;
};

import TuModeloScreen from "./src/screens/TuModeloScreen";
import TuEventoMongoScreen from "./src/screens/TuEventoMongoScreen";

<Stack.Screen name="TuModelo" component={TuModeloScreen} options={{ title: "Tu Título" }} />
<Stack.Screen name="TuEventoMongo" component={TuEventoMongoScreen} options={{ title: "Tu Título" }} />
```

---

## ✅ Archivos que NO debes modificar (reutilizables)

### **1. src/api/http.ts**

- Maneja interceptores de Axios
- Inyecta automáticamente el token JWT desde `global`
- Reutilizable para cualquier proyecto Django + JWT

### **2. src/api/auth.api.ts**

- Función `loginApi(username, password)` estándar
- Reutilizable para cualquier backend Django con `/api/auth/login/`

### **3. src/screens/LoginScreen.tsx**

- Pantalla de login genérica
- Guarda tokens en `global.accessToken` y `global.refreshToken`
- Navega a `"Home"` después de login exitoso
- Reutilizable sin cambios

### **4. src/types/drf.ts**

- Tipos `Paginated<T>` y `toArray()` para manejar paginación de DRF
- Reutilizable para cualquier proyecto Django REST Framework

### **5. src/types/auth.ts**

- Tipos de respuesta de login JWT
- Reutilizable sin cambios

---

## 🗂️ Estructura de Archivos Recomendada

```
cine-rn/
├── App.tsx                          ✅ MODIFICAR (rutas y navegación)
├── app.json                         ✅ MODIFICAR (nombre y slug)
├── package.json                     ✅ MODIFICAR (nombre del proyecto)
├── src/
│   ├── config.ts                    ✅ MODIFICAR (API_BASE_URL)
│   ├── types/
│   │   ├── auth.ts                  ❌ NO MODIFICAR
│   │   ├── drf.ts                   ❌ NO MODIFICAR
│   │   ├── movieCatalog.ts          ✅ RENOMBRAR → tuModelo.ts
│   │   ├── reservation.ts           ✅ RENOMBRAR → tuRelacion.ts
│   │   └── reservationEvent.ts      ✅ RENOMBRAR → tuEventoMongo.ts
│   ├── api/
│   │   ├── http.ts                  ❌ NO MODIFICAR
│   │   ├── auth.api.ts              ❌ NO MODIFICAR
│   │   ├── movieCatalog.api.ts      ✅ RENOMBRAR → tuModelo.api.ts
│   │   ├── reservation.api.ts       ✅ RENOMBRAR → tuRelacion.api.ts
│   │   └── reservationEvent.api.ts  ✅ RENOMBRAR → tuEventoMongo.api.ts
│   └── screens/
│       ├── LoginScreen.tsx          ❌ NO MODIFICAR
│       ├── HomeScreen.tsx           ✅ MODIFICAR (botones de navegación)
│       ├── MovieCatalogScreen.tsx   ✅ RENOMBRAR → TuModeloScreen.tsx
│       └── ReservationEventScreen.tsx ✅ RENOMBRAR → TuEventoMongoScreen.tsx
```

---

## 📦 Pasos para Adaptar el Proyecto

### **Paso 1: Clonar y renombrar**

```bash
cp -r cine-rn mi-nuevo-proyecto-rn
cd mi-nuevo-proyecto-rn
```

### **Paso 2: Actualizar package.json y app.json**

- Cambiar `name` y `slug` en ambos archivos

### **Paso 3: Actualizar src/config.ts**

- Cambiar `API_BASE_URL` a la URL de tu backend

### **Paso 4: Renombrar y actualizar tipos**

- Renombrar archivos en `src/types/`
- Actualizar tipos según tus modelos de Django

### **Paso 5: Renombrar y actualizar APIs**

- Renombrar archivos en `src/api/`
- Cambiar endpoints según tu backend

### **Paso 6: Renombrar y actualizar screens**

- Renombrar archivos en `src/screens/`
- Actualizar formularios, validaciones y listas

### **Paso 7: Actualizar App.tsx**

- Cambiar nombres de rutas
- Importar tus nuevos screens
- Actualizar `RootStackParamList`

### **Paso 8: Actualizar HomeScreen**

- Cambiar botones de navegación
- Actualizar textos y descripciones

### **Paso 9: Instalar dependencias y ejecutar**

```bash
npm install
npx expo start
```

---

## 🎯 Mapeo de Cambios: Proyecto Anterior → Proyecto Cine

| **Archivo/Concepto**          | **Proyecto Anterior (Vehículos)**                                  | **Proyecto Actual (Cine)**                                      |
| ----------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| **Modelo Postgres Principal** | ServiceType (Mongo)                                                | Show (Postgres)                                                 |
| **Modelo Postgres Relación**  | Vehiculo (placa, modelo, año)                                      | Reservation (cliente, asientos, estado)                         |
| **Modelo MongoDB**            | VehicleService (vehiculo_id + service_type_id)                     | ReservationEvent (reservation_id + event_type)                  |
| **Screen Principal**          | ServiceTypesScreen                                                 | MovieCatalogScreen                                              |
| **Screen con Selects**        | VehicleServicesScreen                                              | ReservationEventScreen                                          |
| **Endpoints API**             | `/api/service-types/`, `/api/vehiculos/`, `/api/vehicle-services/` | `/api/shows/`, `/api/reservations/`, `/api/reservation-events/` |
| **Rutas de Navegación**       | `ServiceTypes`, `VehicleServices`                                  | `MovieCatalog`, `ReservationEvent`                              |

---

## 💡 Recomendaciones Finales

1. **Nomenclatura consistente**: Si tu modelo se llama `Product`, usa `ProductScreen`, `product.api.ts`, `product.ts`
2. **Validaciones**: Adapta las funciones de validación según tus requisitos (números, emails, fechas)
3. **Estilos**: Los estilos con tema oscuro de GitHub están centralizados en cada screen, puedes cambiarlos globalmente
4. **Pickers**: Si necesitas más de 2 selects, sigue el mismo patrón de `ReservationEventScreen`
5. **Manejo de errores**: Los mensajes de error están en español, puedes cambiarlos a tu idioma
6. **Autenticación**: `LoginScreen` y `auth.api.ts` funcionan con cualquier backend Django + JWT sin modificaciones
7. **Configuración de Expo**: Revisa `app.json` si necesitas íconos, splash screen o permisos específicos

---

## 🚀 Ejemplo Rápido: Proyecto de Inventario

Si quieres crear un sistema de **Inventario de Productos** con **Movimientos MongoDB**, estos serían los cambios:

### Tipos:

- `movieCatalog.ts` → `product.ts` (Product: id, name, category, price, stock)
- `reservation.ts` → `sale.ts` (Sale: id, product, quantity, customer, date)
- `reservationEvent.ts` → `stockMovement.ts` (StockMovement: id, product_id, movement_type, quantity, note)

### APIs:

- `movieCatalog.api.ts` → `product.api.ts` (`/api/products/`)
- `reservation.api.ts` → `sale.api.ts` (`/api/sales/`)
- `reservationEvent.api.ts` → `stockMovement.api.ts` (`/api/stock-movements/`)

### Screens:

- `MovieCatalogScreen.tsx` → `ProductScreen.tsx`
- `ReservationEventScreen.tsx` → `StockMovementScreen.tsx`

### Navegación:

```tsx
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Product: undefined;
  StockMovement: undefined;
};
```

---

## 📚 Recursos Adicionales

- **Expo Docs**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/
- **Axios**: https://axios-http.com/
- **Django REST Framework**: https://www.django-rest-framework.org/
- **MongoDB con Django**: https://www.mongodb.com/docs/drivers/python/

---

**¡Listo!** Ahora puedes usar este proyecto como base para cualquier aplicación móvil con Django + JWT + Postgres + MongoDB.
