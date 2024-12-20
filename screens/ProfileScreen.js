import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../components/Themecontext";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const goToFavorites = () => {
    // Navega para a tela de Favoritos
    navigation.navigate("Favorites");
  };

  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#eee" }]}>
      <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>Tela de Perfil</Text>
      {/* Botão para navegar para a tela de Favoritos */}
      <Button title="Ir para Favoritos" onPress={goToFavorites} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
  },
});

export default ProfileScreen;
