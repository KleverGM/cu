// ✅ CORREGIDO: Panel admin con botones para Shows y Reservaciones
// ANTES: Tenía botones "CRUD Marcas" y "CRUD Vehículos" a /admin/marcas y /admin/vehiculos
// AHORA: Tiene botones "CRUD Shows" y "CRUD Reservaciones" a /admin/shows y /admin/reservations
import { Container, Paper, Typography, Stack, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function AdminHomePage() {
  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Panel Admin
        </Typography>

        {/* ✅ CORREGIDO: Botones de Marcas/Vehículos a Shows/Reservaciones */}
        {/* ANTES: to="/admin/marcas" y to="/admin/vehiculos" */}
        {/* AHORA: to="/admin/shows" y to="/admin/reservations" */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="contained" component={Link} to="/admin/shows">
            CRUD Shows (Funciones)
          </Button>
          <Button variant="contained" component={Link} to="/admin/reservations">
            CRUD Reservaciones
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
