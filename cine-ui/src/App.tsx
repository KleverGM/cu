// ✅ CORREGIDO: Cambiado de proyecto vehículos a proyecto cine
// ANTES: Importaba PublicVehiclesPage, AdminMarcasPage, AdminVehiculosPage
// AHORA: Importa PublicReservationsPage, AdminShowsPage, AdminReservationsPage
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PublicReservationsPage from "./pages/PublicReservationsPage"; // ✅ CORREGIDO: ANTES PublicVehiclesPage
import LoginPage from "./pages/LoginPage";

import AdminHomePage from "./pages/AdminHomePage";
import AdminShowsPage from "./pages/AdminShowsPage"; // ✅ CORREGIDO: ANTES AdminMarcasPage
import AdminReservationsPage from "./pages/AdminReservationsPage"; // ✅ CORREGIDO: ANTES AdminVehiculosPage

import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          {/* ✅ CORREGIDO: Título de Vehículos UI a Cine UI */}
          {/* ANTES: "Vehículos UI (MUI)" */}
          {/* AHORA: "Cine UI (MUI)" */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Cine UI (MUI)
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/acerca">
              Acerca
            </Button>
            {/* ✅ CORREGIDO: Link de /lista a /reservaciones */}
            <Button color="inherit" component={Link} to="/reservaciones">
              Reservaciones {/* ANTES: Vehículos */}
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/admin">
              Admin
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/acerca" element={<AboutPage />} />
        {/* ✅ CORREGIDO: Ruta de /lista a /reservaciones */}
        {/* ANTES: <Route path="/lista" element={<PublicVehiclesPage />} /> */}
        {/* AHORA: Muestra PublicReservationsPage para ver reservaciones públicas */}
        <Route path="/reservaciones" element={<PublicReservationsPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminHomePage />
            </RequireAuth>
          }
        />

        {/* ✅ CORREGIDO: Ruta de /admin/marcas a /admin/shows */}
        {/* ANTES: <Route path="/admin/marcas" element={<RequireAuth><AdminMarcasPage /></RequireAuth>} /> */}
        {/* AHORA: Administra Shows (funciones de cine) */}
        <Route
          path="/admin/shows"
          element={
            <RequireAuth>
              <AdminShowsPage />
            </RequireAuth>
          }
        />

        {/* ✅ CORREGIDO: Ruta de /admin/vehiculos a /admin/reservations */}
        {/* ANTES: <Route path="/admin/vehiculos" element={<RequireAuth><AdminVehiculosPage /></RequireAuth>} /> */}
        {/* AHORA: Administra Reservations (reservaciones de cine) */}
        <Route
          path="/admin/reservations"
          element={
            <RequireAuth>
              <AdminReservationsPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
