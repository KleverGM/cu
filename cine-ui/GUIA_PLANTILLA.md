    # 📋 GUÍA PARA USAR COMO PLANTILLA EN OTROS PROYECTOS

Este proyecto React + TypeScript + Vite + Material-UI puede ser reutilizado como plantilla para otros proyectos similares.

---

## 🔄 ARCHIVOS QUE DEBES MODIFICAR

### 1. **/.env**

```env
VITE_API_BASE_URL=http://127.0.0.1:8000  # ⚠️ CAMBIAR: URL de tu API Django
```

---

### 2. **/package.json**

```json
{
  "name": "cine-ui",  // ⚠️ CAMBIAR: Nombre de tu proyecto
  ...
}
```

---

### 3. **/src/App.tsx**

```tsx
// ⚠️ CAMBIAR TODO EL CONTENIDO:
// - Título de la app en el AppBar (línea 21)
// - Nombres de rutas y links de navegación
// - Importaciones de páginas según tu proyecto
```

**Qué cambiar:**

- `Título del proyecto` → Tu título
- Rutas: `/`, `/acerca`, `/lista`, `/login`, `/admin`, etc.
- Nombres de páginas importadas

---

### 4. **/src/api/\*.api.ts**

Debes crear archivos API según tus modelos de Django:

#### Ejemplo genérico:

```typescript
// src/api/tumodelo.api.ts
import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// ⚠️ CAMBIAR: Define el tipo según tu modelo Django
export type TuModelo = {
  id: number;
  campo1: string;
  campo2: number;
  created_at?: string;
};

// ⚠️ CAMBIAR: Endpoint de tu API Django
export async function listTuModeloApi() {
  const { data } = await http.get<Paginated<TuModelo>>("/api/tumodelo/");
  return data;
}

export async function createTuModeloApi(payload: Omit<TuModelo, "id">) {
  const { data } = await http.post<TuModelo>("/api/tumodelo/", payload);
  return data;
}

export async function updateTuModeloApi(
  id: number,
  payload: Partial<TuModelo>,
) {
  const { data } = await http.put<TuModelo>(`/api/tumodelo/${id}/`, payload);
  return data;
}

export async function deleteTuModeloApi(id: number) {
  await http.delete(`/api/tumodelo/${id}/`);
}
```

---

### 5. **/src/pages/\*.tsx**

Crea páginas según las necesidades de tu proyecto. Usa como base:

- **HomePage.tsx** → Página de inicio
- **AboutPage.tsx** → Acerca de
- **LoginPage.tsx** → Login (NO modificar lógica de autenticación)
- **PublicListaPage.tsx** → Lista pública de datos
- **AdminHomePage.tsx** → Página admin home
- **AdminTuModeloPage.tsx** → CRUD admin de tu modelo

#### Plantilla genérica para página CRUD Admin:

```tsx
// ⚠️ CAMBIAR:
// 1. Importaciones de API
// 2. Type del modelo
// 3. Estados y campos del formulario
// 4. Columnas de la tabla
// 5. Textos y labels
```

---

## 📂 ARCHIVOS QUE **NO** DEBES MODIFICAR

### ✅ Mantener tal cual:

1. **/src/api/http.ts** → Configuración de Axios con interceptores JWT
2. **/src/api/auth.api.ts** → API de autenticación (funciona para cualquier Django + JWT)
3. **/src/components/RequireAuth.tsx** → Componente de protección de rutas
4. **/src/main.tsx** → Punto de entrada de React
5. **/src/index.css** → Estilos CSS globales (opcional modificar)
6. **/vite.config.ts** → Configuración de Vite
7. **tsconfig.\*.json** → Configuración de TypeScript
8. **eslint.config.js** → Configuración de ESLint

---

## 🎯 PASOS PARA ADAPTAR A NUEVO PROYECTO

### Paso 1: Clonar/copiar proyecto

```bash
cp -r cine-ui mi-nuevo-proyecto-ui
cd mi-nuevo-proyecto-ui
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar .env

```env
VITE_API_BASE_URL=http://127.0.0.1:8000  # Tu backend
```

### Paso 4: Modificar package.json

Cambiar `"name": "mi-nuevo-proyecto-ui"`

### Paso 5: Crear archivos API

- Crear `src/api/tumodelo.api.ts` para cada modelo de tu backend
- Definir tipos TypeScript según modelos Django

### Paso 6: Crear páginas

- Crear páginas en `src/pages/` según necesites
- Usar como base las páginas Admin existentes para CRUD

### Paso 7: Configurar rutas en App.tsx

- Importar tus páginas
- Definir rutas
- Actualizar navegación del AppBar

### Paso 8: Ejecutar

```bash
npm run dev
```

---

## 🔑 PUNTOS CLAVE DE AUTENTICACIÓN

El sistema de autenticación JWT ya está implementado y funciona así:

1. **Login** → Guarda `accessToken` en `localStorage`
2. **http.ts** interceptor → Agrega `Authorization: Bearer <token>` a todas las peticiones
3. **RequireAuth** → Protege rutas admin, redirige a `/login` si no hay token
4. **Logout** → Solo borrar `localStorage.removeItem("accessToken")` y redirigir

**No necesitas modificar la lógica de autenticación** a menos que cambies el backend de Django Rest Framework + JWT.

---

## 📊 MAPEO PROYECTO ACTUAL (CINE)

| Archivo                    | Modelo Django | Endpoint API       | Propósito                 |
| -------------------------- | ------------- | ------------------ | ------------------------- |
| shows.api.ts               | Show          | /api/shows/        | Funciones de cine         |
| reservations.api.ts        | Reservation   | /api/reservations/ | Reservaciones             |
| AdminShowsPage.tsx         | -             | -                  | CRUD Shows (admin)        |
| AdminReservationsPage.tsx  | -             | -                  | CRUD Reservations (admin) |
| PublicReservationsPage.tsx | -             | -                  | Lista pública             |

---

## ✨ MEJORAS RECOMENDADAS

1. **Paginación**: Actualmente solo carga primera página. Implementar navegación entre páginas.
2. **Búsqueda/Filtros**: Agregar campos de búsqueda en las listas.
3. **Validación**: Mejorar validación de formularios (usar react-hook-form o formik).
4. **Notificaciones**: Usar Snackbar de MUI en lugar de Alert para feedback.
5. **Carga**: Agregar indicadores de carga (CircularProgress) durante peticiones.
6. **Manejo de errores**: Mejorar mensajes de error específicos.

---

## 🛠️ COMANDOS ÚTILES

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Linter
npm run lint
```

---

## 📝 NOTAS FINALES

- Este proyecto usa **Material-UI v7** con componentes ya estilizados
- **React Router v7** para navegación
- **Axios** para peticiones HTTP
- **TypeScript** para tipado estático
- **Vite** como bundler (más rápido que Webpack)

**Compatibilidad con Django:**

- Funciona con Django Rest Framework
- Requiere JWT authentication (djangorestframework-simplejwt)
- Espera respuestas paginadas con formato: `{ count, next, previous, results }`
