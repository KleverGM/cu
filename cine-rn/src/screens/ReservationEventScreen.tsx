// ✅ CORREGIDO: Pantalla para gestionar ReservationEvents (eventos de reservación en MongoDB)
// ANTES: VehicleServicesScreen - Gestionaba vehicle_services con 2 selects (vehiculo_id + service_type_id)
// AHORA: ReservationEventScreen - Gestiona reservation_events con 2 selects (reservation_id + event_type)
import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// ✅ CORREGIDO: Importados de reservation.api y reservationEvent.api
import { listReservationsApi } from "../api/reservation.api"; // ✅ ANTES: vehiculos.api
import {
  listReservationEventsApi,
  createReservationEventApi,
  deleteReservationEventApi,
} from "../api/reservationEvent.api"; // ✅ ANTES: vehicleServices.api

import type { Reservation } from "../types/reservation"; // ✅ ANTES: Vehiculo
import type { ReservationEvent } from "../types/reservationEvent"; // ✅ ANTES: VehicleService
import { toArray } from "../types/drf";

// ✅ CORREGIDO: Opciones de event_type para el proyecto de cine
// ANTES: serviceTypeLabel para obtener nombre de Mongo
// AHORA: EVENT_TYPE_OPTIONS con valores predefinidos
const EVENT_TYPE_OPTIONS = [
  { value: "created", label: "Creado" },
  { value: "modified", label: "Modificado" },
  { value: "cancelled", label: "Cancelado" },
];

const SOURCE_OPTIONS = [
  { value: "web", label: "Web" },
  { value: "mobile", label: "Móvil" },
  { value: "admin", label: "Admin" },
];

export default function ReservationEventScreen() {
  const [events, setEvents] = useState<ReservationEvent[]>([]); // ✅ ANTES: services: VehicleService[]
  const [reservations, setReservations] = useState<Reservation[]>([]); // ✅ ANTES: vehiculos: Vehiculo[]

  // ✅ CORREGIDO: Estados para selects
  // ANTES: selectedVehiculoId (number | null), selectedServiceTypeId (string)
  // AHORA: selectedReservationId (number | null), selectedEventType (string)
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [selectedEventType, setSelectedEventType] = useState<string>("created");
  const [selectedSource, setSelectedSource] = useState<string>("mobile");

  // ✅ CORREGIDO: note en lugar de notes y cost
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ CORREGIDO: Mapa de reservations por ID
  const reservationById = useMemo(() => {
    const map = new Map<number, Reservation>();
    reservations.forEach((r) => map.set(r.id, r));
    return map;
  }, [reservations]);

  const loadAll = async (): Promise<void> => {
    try {
      setErrorMessage("");

      // ✅ CORREGIDO: Cargar reservation_events y reservations
      // ANTES: [listVehicleServicesApi(), listVehiculosApi(), listServiceTypesApi()]
      // AHORA: [listReservationEventsApi(), listReservationsApi()]
      const [eventsData, reservationsData] = await Promise.all([
        listReservationEventsApi(),
        listReservationsApi(),
      ]);

      const eventsList = toArray(eventsData);
      const reservationsList = toArray(reservationsData);

      setEvents(eventsList);
      setReservations(reservationsList);

      // ✅ CORREGIDO: Seleccionar primera reservation si existe
      if (selectedReservationId === null && reservationsList.length)
        setSelectedReservationId(reservationsList[0].id);
    } catch {
      setErrorMessage(
        "No se pudo cargar info. ¿Token? ¿baseURL? ¿backend encendido?",
      );
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const createEvent = async (): Promise<void> => {
    try {
      setErrorMessage("");

      // ✅ CORREGIDO: Validación de campos
      // ANTES: selectedVehiculoId y selectedServiceTypeId
      // AHORA: selectedReservationId y selectedEventType
      if (selectedReservationId === null)
        return setErrorMessage("Seleccione una reservación");
      if (!selectedEventType)
        return setErrorMessage("Seleccione un tipo de evento");

      const trimmedNote = note.trim() ? note.trim() : undefined;

      // ✅ CORREGIDO: Payload para crear ReservationEvent
      // ANTES: { vehiculo_id, service_type_id, notes?, cost? }
      // AHORA: { reservation_id, event_type, source?, note? }
      // NO enviar created_at, backend la asigna automáticamente
      const created = await createReservationEventApi({
        reservation_id: selectedReservationId,
        event_type: selectedEventType,
        source: selectedSource,
        note: trimmedNote,
      });

      setEvents((prev) => [created, ...prev]);
      setNote("");
    } catch {
      setErrorMessage("No se pudo crear evento de reservación");
    }
  };

  const removeEvent = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteReservationEventApi(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar evento de reservación");
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ CORREGIDO: Título de pantalla */}
      <Text style={styles.title}>Eventos de Reservación</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      {/* ✅ CORREGIDO: Picker de Reservation en lugar de Vehiculo */}
      {/* ANTES: "Vehículo (placa — dueño si existe)" */}
      {/* AHORA: "Reservación (cliente - película)" */}
      <Text style={styles.label}>Reservación (cliente - película)</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedReservationId ?? ""}
          onValueChange={(value) => setSelectedReservationId(Number(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {reservations.map((r) => (
            <Picker.Item
              key={r.id}
              label={`${r.customer_name} - ${r.show_movie_title || `Show #${r.show}`}`}
              value={r.id}
            />
          ))}
        </Picker>
      </View>

      {/* ✅ CORREGIDO: Picker de EventType en lugar de ServiceType (Mongo) */}
      {/* ANTES: serviceTypes desde Mongo con { id, name, description } */}
      {/* AHORA: EVENT_TYPE_OPTIONS predefinido (created, modified, cancelled) */}
      <Text style={styles.label}>Tipo de Evento</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedEventType}
          onValueChange={(value) => setSelectedEventType(String(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {EVENT_TYPE_OPTIONS.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      {/* ✅ AGREGADO: Picker de Source */}
      <Text style={styles.label}>Origen (opcional)</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedSource}
          onValueChange={(value) => setSelectedSource(String(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {SOURCE_OPTIONS.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      {/* ✅ CORREGIDO: note en lugar de notes y cost */}
      {/* ANTES: TextInput para notes y costInput */}
      {/* AHORA: Solo note (opcional) */}
      <Text style={styles.label}>Nota (opcional)</Text>
      <TextInput
        placeholder="Comentario adicional"
        placeholderTextColor="#8b949e"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <Pressable
        onPress={createEvent}
        style={[styles.btn, { marginBottom: 12 }]}
      >
        <Text style={styles.btnText}>Crear (sin enviar fecha)</Text>
      </Pressable>

      <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      {/* ✅ CORREGIDO: Lista de ReservationEvents */}
      {/* ANTES: Mostraba vehiculo.placa, serviceType.name, cost, notes, date */}
      {/* AHORA: Muestra reservation (cliente), event_type, source, note, created_at */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const r = reservationById.get(item.reservation_id);

          const line1 = r
            ? `${r.customer_name} - ${r.show_movie_title || `Show #${r.show}`}`
            : `reservation_id: ${item.reservation_id}`;
          const line2 = `Evento: ${item.event_type}`;

          const extras: string[] = [];
          if (item.source) extras.push(`Origen: ${item.source}`);
          if (item.note) extras.push(`Nota: ${item.note}`);
          if (item.created_at) extras.push(`Fecha: ${item.created_at}`);

          return (
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.rowText} numberOfLines={1}>
                  {line1}
                </Text>
                <Text style={styles.rowSub} numberOfLines={1}>
                  {line2}
                </Text>
                {extras.map((t, idx) => (
                  <Text key={idx} style={styles.rowSub} numberOfLines={1}>
                    {t}
                  </Text>
                ))}
              </View>

              <Pressable onPress={() => removeEvent(item.id)}>
                <Text style={styles.del}>Eliminar</Text>
              </Pressable>
            </View>
          );
        }}
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

  pickerWrap: {
    backgroundColor: "#161b22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { color: "#c9d1d9" },

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
  del: { color: "#ff7b72", fontWeight: "800" },
});
