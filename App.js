import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Notifications from "expo-notifications";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import MovieDetailScreen from "./screens/MovieDetailScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { ThemeProvider } from "./components/Themecontext";

// Configuração de comportamento para notificações em primeiro e segundo plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false, 
  }),
});

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator para telas que devem aparecer no menu
const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
);

// Stack Navigator para telas que não devem aparecer no Drawer
const StackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Main" component={DrawerNavigator} />
    <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
    <Stack.Screen name="Favorites" component={FavoriteScreen} />
  </Stack.Navigator>
);

const App = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      // Solicitar permissão para notificações
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permissão para notificações negada.");
        return;
      }

      // Cancelar notificações anteriores (se necessário)
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Agendar uma notificação para ser exibida a cada 1 minuto
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Favoritar seus filmes 🎥",
          body: "Venha adicionar seus filmes favoritos!",
          data: { action: "favoritar" },
        },
        trigger: {
          seconds: 60, // Notificação repetida a cada 60 segundos
          repeats: true,
        },
      });
    };

    setupNotifications();
  }, []);

  return (
     <ThemeProvider>
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
