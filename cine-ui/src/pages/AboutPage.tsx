// ✅ CORREGIDO: Información de endpoints del proyecto de cine
// ANTES: Listaba endpoints /api/vehiculos/ y /api/marcas/
// AHORA: Lista endpoints /api/reservations/ y /api/shows/
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function AboutPage() {
  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Acerca de
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Endpoints usados:
        </Typography>

        {/* ✅ CORREGIDO: Endpoints de vehículos/marcas a shows/reservations */}
        {/* ANTES: GET /api/vehiculos/, CRUD /api/marcas/, CRUD /api/vehiculos/ */}
        {/* AHORA: GET /api/reservations/, CRUD /api/shows/, CRUD /api/reservations/ */}
        <List dense>
          <ListItem>
            <ListItemText primary="GET /api/reservations/ (público, paginado)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="POST /api/auth/login/ (JWT)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="CRUD /api/shows/ (admin, paginado en LIST)" />
          </ListItem>
          <ListItem>
            <ListItemText primary="CRUD /api/reservations/ (admin, paginado en LIST)" />
          </ListItem>
        </List>

        <Typography variant="body2" color="text.secondary">
          Base URL: VITE_API_BASE_URL.
        </Typography>
      </Paper>
    </Container>
  );
}
