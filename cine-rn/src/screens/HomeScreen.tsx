// ✅ CORREGIDO: Pantalla de menú principal para app de cine
// ANTES: Navegaba a "ServiceTypes" y "VehicleServices"
// AHORA: Navega a "MovieCatalog" (Shows) y "ReservationEvent" (Eventos MongoDB)
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../App";

type Nav = NativeStackNavigationProp<RootStackParamList, "Home">;

type GlobalAuthStore = { accessToken?: string; refreshToken?: string };

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  const logout = (): void => {
    const store = global as unknown as GlobalAuthStore;
    store.accessToken = undefined;
    store.refreshToken = undefined;
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú</Text>
      {/* ✅ CORREGIDO: Subtítulo actualizado para el proyecto de cine */}
      {/* ANTES: "CRUD Mongo mínimo + selects" */}
      {/* AHORA: "Gestión de Funciones y Eventos de Reservación" */}
      <Text style={styles.sub}>
        Gestión de Funciones y Eventos de Reservación
      </Text>

      {/* ✅ CORREGIDO: Botón de Service Types a Movie Catalog (Shows) */}
      {/* ANTES: navigation.navigate("ServiceTypes") */}
      {/* AHORA: navigation.navigate("MovieCatalog") */}
      <Pressable
        onPress={() => navigation.navigate("MovieCatalog")}
        style={styles.btn}
      >
        <Text style={styles.btnText}>
          Catálogo de Funciones (list/create/delete)
        </Text>
      </Pressable>

      {/* ✅ CORREGIDO: Botón de Vehicle Services a Reservation Events */}
      {/* ANTES: navigation.navigate("VehicleServices") - con 2 selects (vehiculo + service_type) */}
      {/* AHORA: navigation.navigate("ReservationEvent") - con 2 selects (reservation + event_type) */}
      <Pressable
        onPress={() => navigation.navigate("ReservationEvent")}
        style={styles.btn}
      >
        <Text style={styles.btnText}>
          Eventos de Reservación (2 selects + create/delete)
        </Text>
      </Pressable>

      <Pressable onPress={logout} style={[styles.btn, styles.btnDanger]}>
        <Text style={[styles.btnText, styles.btnDangerText]}>
          Salir (logout)
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: {
    color: "#58a6ff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
    marginTop: 10,
  },
  sub: { color: "#8b949e", marginBottom: 14 },
  btn: {
    backgroundColor: "#21262d",
    borderColor: "#58a6ff",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },
  btnDanger: { borderColor: "#ff7b72" },
  btnDangerText: { color: "#ff7b72" },
});
