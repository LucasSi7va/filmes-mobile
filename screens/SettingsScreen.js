import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { useTheme } from "../components/Themecontext";

const SettingsScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  // Função para ativar notificações
  const enableNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão Negada", "As notificações não foram ativadas.");
      setIsNotificationsEnabled(false);
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync(); // Limpar notificações anteriores
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Favoritar seus filmes 🎥",
        body: "Venha adicionar seus filmes favoritos!",
      },
      trigger: {
        seconds: 60, // Repetir a cada 60 segundos
        repeats: true,
      },
    });

    Alert.alert("Notificações Ativadas", "Notificações agendadas com sucesso!");
  };

  // Função para desativar notificações
  const disableNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert("Notificações Desativadas", "Todas as notificações foram canceladas.");
  };

  // Alternar o estado do switch de notificações
  const toggleNotificationsSwitch = () => {
    if (isNotificationsEnabled) {
      disableNotifications();
    } else {
      enableNotifications();
    }
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#121212" : "#fff" },
      ]}
    >
      <Text style={[styles.text, { color: isDarkMode ? "#fff" : "#000" }]}>Configurações</Text>

      {/* Configuração de Notificações */}
      <View style={styles.switchContainer}>
        <Text
          style={[
            styles.switchLabel,
            { color: isDarkMode ? "#fff" : "#000" },
          ]}
        >
          {isNotificationsEnabled
            ? "Notificações Ativadas"
            : "Notificações Desativadas"}
        </Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={toggleNotificationsSwitch}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isNotificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      {/* Configuração de Modo Escuro */}
      <View style={styles.switchContainer}>
        <Text
          style={[
            styles.switchLabel,
            { color: isDarkMode ? "#fff" : "#000" },
          ]}
        >
          {isDarkMode ? "Modo Escuro" : "Modo Claro"}
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
});

export default SettingsScreen;