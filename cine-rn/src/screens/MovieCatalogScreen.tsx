// ✅ CORREGIDO: Pantalla para gestionar Shows (funciones de cine)
// ANTES: ServiceTypesScreen - Gestionaba service types con { id, name, description }
// AHORA: MovieCatalogScreen - Gestiona shows con { id, movie_title, room, price, available_seats }
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";

// ✅ CORREGIDO: Importado de movieCatalog.api en lugar de serviceTypes.api
import {
  listShowsApi,
  createShowApi,
  deleteShowApi,
} from "../api/movieCatalog.api"; // ✅ ANTES: serviceTypes.api
import type { Show } from "../types/movieCatalog"; // ✅ ANTES: ServiceType
import { toArray } from "../types/drf";

function normalizeText(input: string): string {
  return input.trim();
}

// ✅ CORREGIDO: Función para validar números
function parsePositiveNumber(
  input: string,
  fieldName: string,
): {
  value?: number;
  error?: string;
} {
  const trimmed = input.trim();
  if (!trimmed) return { error: `${fieldName} es requerido` };
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return { error: `${fieldName} debe ser un número positivo` };
  }
  return { value: parsed };
}

export default function MovieCatalogScreen() {
  const [items, setItems] = useState<Show[]>([]); // ✅ ANTES: ServiceType[]

  // ✅ CORREGIDO: Estados para campos de Show
  // ANTES: const [name, setName] setState, [description, setDescription]
  // AHORA: 4 campos (movie_title, room, price, available_seats)
  const [movieTitle, setMovieTitle] = useState(""); // ✅ ANTES: name
  const [room, setRoom] = useState(""); // ✅ AGREGADO
  const [priceInput, setPriceInput] = useState(""); // ✅ AGREGADO
  const [seatsInput, setSeatsInput] = useState(""); // ✅ AGREGADO
  const [errorMessage, setErrorMessage] = useState("");

  const load = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const data = await listShowsApi(); // ✅ ANTES: listServiceTypesApi
      setItems(toArray(data));
    } catch {
      setErrorMessage("No se pudo cargar funciones. ¿Login? ¿Token?"); // ✅ ANTES: "service types"
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createItem = async (): Promise<void> => {
    try {
      setErrorMessage("");

      // ✅ CORREGIDO: Validación de campos de Show
      // ANTES: Solo validaba name
      // AHORA: Valida movie_title, room, price, available_seats
      const cleanTitle = normalizeText(movieTitle);
      if (!cleanTitle)
        return setErrorMessage("Título de película es requerido");

      const cleanRoom = normalizeText(room);
      if (!cleanRoom) return setErrorMessage("Sala es requerida");

      const priceResult = parsePositiveNumber(priceInput, "Precio");
      if (priceResult.error) return setErrorMessage(priceResult.error);

      const seatsResult = parsePositiveNumber(
        seatsInput,
        "Asientos disponibles",
      );
      if (seatsResult.error) return setErrorMessage(seatsResult.error);

      // ✅ CORREGIDO: Payload para crear Show
      // ANTES: { name, description? }
      // AHORA: { movie_title, room, price, available_seats }
      const created = await createShowApi({
        movie_title: cleanTitle,
        room: cleanRoom,
        price: priceResult.value!,
        available_seats: seatsResult.value!,
      });

      setItems((prev) => [created, ...prev]);
      // ✅ CORREGIDO: Limpiar todos los campos
      setMovieTitle("");
      setRoom("");
      setPriceInput("");
      setSeatsInput("");
    } catch {
      setErrorMessage("No se pudo crear función."); // ✅ ANTES: "service type"
    }
  };

  const removeItem = async (id: number): Promise<void> => {
    // ✅ ANTES: id: string
    try {
      setErrorMessage("");
      await deleteShowApi(id); // ✅ ANTES: deleteServiceTypeApi
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar función."); // ✅ ANTES: "service type"
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ CORREGIDO: Título de pantalla */}
      <Text style={styles.title}>Catálogo de Funciones</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      {/* ✅ CORREGIDO: Formulario con campos de Show */}
      {/* ANTES: Solo Name y Description */}
      {/* AHORA: movie_title, room, price, available_seats */}
      <Text style={styles.label}>Título de la Película</Text>
      <TextInput
        value={movieTitle}
        onChangeText={setMovieTitle}
        placeholder="Avatar 2"
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Text style={styles.label}>Sala</Text>
      <TextInput
        value={room}
        onChangeText={setRoom}
        placeholder="Sala 1"
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        value={priceInput}
        onChangeText={setPriceInput}
        placeholder="10.50"
        placeholderTextColor="#8b949e"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <Text style={styles.label}>Asientos Disponibles</Text>
      <TextInput
        value={seatsInput}
        onChangeText={setSeatsInput}
        placeholder="100"
        placeholderTextColor="#8b949e"
        keyboardType="number-pad"
        style={styles.input}
      />

      <Pressable onPress={createItem} style={styles.btn}>
        <Text style={styles.btnText}>Crear</Text>
      </Pressable>

      <Pressable onPress={load} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      {/* ✅ CORREGIDO: Lista de Shows */}
      {/* ANTES: Mostraba name y description */}
      {/* AHORA: Muestra movie_title, room, price, available_seats */}
      {/* ANTES: keyExtractor usaba item.id (string de Mongo), AHORA: item.id.toString() (number de Postgres) */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              {/* ✅ ANTES: item.name | AHORA: item.movie_title */}
              <Text style={styles.rowText} numberOfLines={1}>
                {item.movie_title}
              </Text>
              {/* ✅ ANTES: item.description | AHORA: room, price, available_seats */}
              <Text style={styles.rowSub} numberOfLines={1}>
                {item.room} • ${item.price} • {item.available_seats} asientos
              </Text>
            </View>

            <Pressable onPress={() => removeItem(item.id)}>
              <Text style={styles.del}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: {
    color: "#58a6ff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
  },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },
  btn: {
    backgroundColor: "#21262d",
    borderColor: "#58a6ff",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
  },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },
  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "700" },
});
