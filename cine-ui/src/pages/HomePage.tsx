// ✅ CORREGIDO: Página de inicio con información del proyecto de cine
// ANTES: Mostraba "Examen Frontend — Vehículos UI" con icono de auto
// AHORA: Muestra "Sistema de Reservaciones de Cine" con icono de película
import { Container, Paper, Typography, Stack } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie"; // ✅ ANTES: DirectionsCarIcon

export default function HomePage() {
  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <MovieIcon /> {/* ✅ ANTES: <DirectionsCarIcon /> */}
          {/* ✅ CORREGIDO: Título de Vehículos UI a Cine UI */}
          <Typography variant="h5">Sistema de Reservaciones de Cine</Typography>
        </Stack>

        <Typography variant="body1" sx={{ mb: 2 }}>
          SPA React + TypeScript + MUI + Router. Consume la API de reservaciones
          de cine (DRF paginado).
        </Typography>

        {/* ✅ CORREGIDO: Flujo de navegación actualizado */}
        {/* ANTES: "Lista (público) → Login → Admin (Panel) → CRUD Marcas / Vehículos" */}
        {/* AHORA: Flujo para Shows y Reservaciones */}
        <Typography variant="body2" color="text.secondary">
          Flujo: Lista de Reservaciones (público) → Login → Admin (Panel) → CRUD
          Shows / Reservaciones.
        </Typography>
      </Paper>
    </Container>
  );
}
