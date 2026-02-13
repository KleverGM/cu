// ✅ CORREGIDO: Página Admin para Reservations (reservaciones de cine)
// ANTES: AdminVehiculosPage.tsx - Administraba vehículos (marca, modelo, año, placa, color)
// AHORA: AdminReservationsPage.tsx - Administra reservaciones (función, cliente, asientos, estado)
import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// ✅ CORREGIDO: Importados de shows.api y reservations.api en lugar de marcas.api y vehiculos.api
import { type Show, listShowsApi } from "../api/shows.api"; // ✅ ANTES: marcas.api
import {
  type Reservation,
  listReservationsAdminApi,
  createReservationApi,
  updateReservationApi,
  deleteReservationApi,
} from "../api/reservations.api"; // ✅ ANTES: vehiculos.api

export default function AdminReservationsPage() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [shows, setShows] = useState<Show[]>([]); // ✅ ANTES: marcas
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  // ✅ CORREGIDO: Estados para campos de Reservation
  // ANTES: marca, modelo, anio, placa, color
  // AHORA: show, customerName, seats, status
  const [show, setShow] = useState<number>(0); // ✅ ANTES: marca (FK a Marca)
  const [customerName, setCustomerName] = useState(""); // ✅ ANTES: modelo
  const [seats, setSeats] = useState(1); // ✅ ANTES: anio
  const [status, setStatus] = useState("Reserved"); // ✅ ANTES: placa

  const load = async () => {
    try {
      setError("");
      const data = await listReservationsAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar reservaciones. ¿Login? ¿Token admin?");
    }
  };

  const loadShows = async () => {
    try {
      const data = await listShowsApi();
      setShows(data.results); // DRF paginado
      if (!show && data.results.length > 0) setShow(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => {
    load();
    loadShows();
  }, []);

  const save = async () => {
    try {
      setError("");
      // ✅ CORREGIDO: Validación de campos de Reservation
      // ANTES: if (!marca) || if (!modelo.trim()) || if (!placa.trim())
      // AHORA: Valida función, cliente y asientos
      if (!show) return setError("Seleccione una función");
      if (!customerName.trim())
        return setError("Nombre del cliente es requerido");
      if (seats <= 0) return setError("Los asientos deben ser mayor a 0");

      // ✅ CORREGIDO: Payload con campos de Reservation
      // ANTES: { marca, modelo, anio, placa, color }
      // AHORA: { show, customer_name, seats, status }
      const payload = {
        show: Number(show),
        customer_name: customerName.trim(),
        seats: Number(seats),
        status,
      };

      if (editId) await updateReservationApi(editId, payload);
      else await createReservationApi(payload as any);

      setEditId(null);
      setCustomerName("");
      setSeats(1);
      setStatus("Reserved");
      await load();
    } catch {
      setError("No se pudo guardar reservación. ¿Token admin?");
    }
  };

  const startEdit = (r: Reservation) => {
    setEditId(r.id);
    setShow(r.show);
    setCustomerName(r.customer_name);
    setSeats(r.seats);
    setStatus(r.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteReservationApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar reservación. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* ✅ CORREGIDO: Título de Admin Vehículos a Admin Reservations */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Admin Reservations - Reservaciones de Cine (Privado)
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* ✅ CORREGIDO: Formulario con campos de Reservation */}
        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ width: 300 }}>
              <InputLabel id="show-label">Función</InputLabel>
              <Select
                labelId="show-label"
                label="Función"
                value={show}
                onChange={(e) => setShow(Number(e.target.value))}
              >
                {shows.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.movie_title} - {s.room} (#{s.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Nombre del Cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Asientos"
              type="number"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              sx={{ width: 120 }}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ width: 200 }}>
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                label="Estado"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Reserved">Reserved</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" onClick={save}>
              {editId ? "Actualizar" : "Crear"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setEditId(null);
                setCustomerName("");
                setSeats(1);
                setStatus("Reserved");
              }}
            >
              Limpiar
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                load();
                loadShows();
              }}
            >
              Refrescar
            </Button>
          </Stack>
        </Stack>

        {/* ✅ CORREGIDO: Tabla con columnas de Reservation */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Película</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Asientos</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.show_movie_title ?? `Show #${r.show}`}</TableCell>
                <TableCell>{r.customer_name}</TableCell>
                <TableCell>{r.seats}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell>
                  {r.created_at
                    ? new Date(r.created_at).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(r)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => remove(r.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
