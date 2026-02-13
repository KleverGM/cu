// ✅ CORREGIDO: Navegación para app de cine con React Native
// ANTES: Importaba ServiceTypesScreen y VehicleServicesScreen
// AHORA: Importa MovieCatalogScreen y ReservationEventScreen
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MovieCatalogScreen from "./src/screens/MovieCatalogScreen"; // ✅ ANTES: ServiceTypesScreen
import ReservationEventScreen from "./src/screens/ReservationEventScreen"; // ✅ ANTES: VehicleServicesScreen

// ✅ CORREGIDO: Tipos de rutas actualizados
// ANTES: ServiceTypes, VehicleServices
// AHORA: MovieCatalog, ReservationEvent
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  MovieCatalog: undefined; // ✅ ANTES: ServiceTypes
  ReservationEvent: undefined; // ✅ ANTES: VehicleServices
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Menú" }}
        />
        {/* ✅ CORREGIDO: Ruta de ServiceTypes a MovieCatalog */}
        <Stack.Screen
          name="MovieCatalog"
          component={MovieCatalogScreen}
          options={{ title: "Catálogo de Funciones" }}
        />
        {/* ✅ CORREGIDO: Ruta de VehicleServices a ReservationEvent */}
        <Stack.Screen
          name="ReservationEvent"
          component={ReservationEventScreen}
          options={{ title: "Eventos de Reservación" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
