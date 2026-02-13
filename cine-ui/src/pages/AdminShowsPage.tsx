// ✅ CORREGIDO: Página Admin para Shows (funciones de cine)
// ANTES: AdminMarcasPage.tsx - Administraba marcas de vehículos (solo nombre)
// AHORA: AdminShowsPage.tsx - Administra funciones de cine (película, sala, precio, asientos)
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// ✅ CORREGIDO: Importado de shows.api en lugar de marcas.api
import {
  type Show,
  listShowsApi,
  createShowApi,
  updateShowApi,
  deleteShowApi,
} from "../api/shows.api";

export default function AdminShowsPage() {
  const [items, setItems] = useState<Show[]>([]);
  // ✅ CORREGIDO: Estados para campos de Show
  // ANTES: const [nombre, setNombre] = useState(""); (solo 1 campo)
  // AHORA: 4 campos para Show (película, sala, precio, asientos)
  const [movieTitle, setMovieTitle] = useState(""); // ✅ ANTES: nombre
  const [room, setRoom] = useState(""); // ✅ AGREGADO: sala de cine
  const [price, setPrice] = useState(0); // ✅ AGREGADO: precio de la función
  const [availableSeats, setAvailableSeats] = useState(0); // ✅ AGREGADO: asientos disponibles
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listShowsApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar shows. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      setError("");
      // ✅ CORREGIDO: Validación de campos de Show
      // ANTES: Solo validaba if (!nombre.trim())
      // AHORA: Valida película, sala, precio y asientos
      if (!movieTitle.trim() || !room.trim()) {
        return setError("Título de película y sala son requeridos");
      }
      if (price <= 0 || availableSeats <= 0) {
        return setError("Precio y asientos deben ser mayores a 0");
      }

      // ✅ CORREGIDO: Payload con campos de Show
      // ANTES: const payload = { nombre: nombre.trim() };
      // AHORA: payload con movie_title, room, price, available_seats
      const payload = {
        movie_title: movieTitle.trim(),
        room: room.trim(),
        price: Number(price),
        available_seats: Number(availableSeats),
      };

      if (editId) await updateShowApi(editId, payload);
      else await createShowApi(payload);

      // Limpiar formulario
      setMovieTitle("");
      setRoom("");
      setPrice(0);
      setAvailableSeats(0);
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar show. ¿Token admin?");
    }
  };

  const startEdit = (s: Show) => {
    setEditId(s.id);
    setMovieTitle(s.movie_title);
    setRoom(s.room);
    setPrice(s.price);
    setAvailableSeats(s.available_seats);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteShowApi(id);
      await load();
    } catch {
      setError(
        "No se pudo eliminar show. ¿Reservaciones asociadas? ¿Token admin?",
      );
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* ✅ CORREGIDO: Título de Admin Marcas a Admin Shows */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Admin Shows - Funciones de Cine (Privado)
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* ✅ CORREGIDO: Formulario con campos de Show */}
        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Título de la Película"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Sala"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              sx={{ width: 200 }}
              placeholder="Ej: Sala 1, VIP-A"
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Precio"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              sx={{ width: 150 }}
            />
            <TextField
              label="Asientos Disponibles"
              type="number"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(Number(e.target.value))}
              sx={{ width: 150 }}
            />
            <Button variant="contained" onClick={save}>
              {editId ? "Actualizar" : "Crear"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setMovieTitle("");
                setRoom("");
                setPrice(0);
                setAvailableSeats(0);
                setEditId(null);
              }}
            >
              Limpiar
            </Button>
            <Button variant="outlined" onClick={load}>
              Refrescar
            </Button>
          </Stack>
        </Stack>

        {/* ✅ CORREGIDO: Tabla con columnas de Show */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Película</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Asientos</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.movie_title}</TableCell>
                <TableCell>{s.room}</TableCell>
                <TableCell>${s.price}</TableCell>
                <TableCell>{s.available_seats}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(s)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => remove(s.id)}>
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
