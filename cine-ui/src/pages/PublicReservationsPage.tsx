// ✅ CORREGIDO: Página pública para ver reservaciones
// ANTES: PublicVehiclesPage.tsx - Listaba vehículos públicos (marca, modelo, año, placa, color)
// AHORA: PublicReservationsPage.tsx - Lista reservaciones públicas (película, cliente, asientos, estado, fecha)
import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  type Reservation, // ✅ ANTES: type Vehiculo
  listReservationsPublicApi, // ✅ ANTES: listVehiculosPublicApi
} from "../api/reservations.api"; // ✅ ANTES: vehiculos.api

export default function PublicReservationsPage() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listReservationsPublicApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar la lista pública. ¿Backend encendido?");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          {/* ✅ CORREGIDO: Título de Vehículos a Reservaciones */}
          <Typography variant="h5">Lista de Reservaciones (Público)</Typography>
          <Button variant="outlined" onClick={load}>
            Refrescar
          </Button>
        </Stack>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* ✅ CORREGIDO: Tabla con columnas de Reservation */}
        {/* ANTES: Columnas: ID, Marca, Modelo, Año, Placa, Color */}
        {/* AHORA: Columnas: ID, Película, Cliente, Asientos, Estado, Fecha */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Película</TableCell> {/* ✅ ANTES: Marca */}
              <TableCell>Cliente</TableCell> {/* ✅ ANTES: Modelo */}
              <TableCell>Asientos</TableCell> {/* ✅ ANTES: Año */}
              <TableCell>Estado</TableCell> {/* ✅ ANTES: Placa */}
              <TableCell>Fecha</TableCell> {/* ✅ ANTES: Color */}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>
                  {r.show_movie_title ?? `Show #${r.show}`}
                </TableCell>{" "}
                {/* ✅ ANTES: v.marca_nombre */}
                <TableCell>{r.customer_name}</TableCell>{" "}
                {/* ✅ ANTES: v.modelo */}
                <TableCell>{r.seats}</TableCell> {/* ✅ ANTES: v.anio */}
                <TableCell>{r.status}</TableCell> {/* ✅ ANTES: v.placa */}
                <TableCell>
                  {r.created_at
                    ? new Date(r.created_at).toLocaleDateString()
                    : "-"}{" "}
                  {/* ✅ ANTES: v.color || "-" */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
