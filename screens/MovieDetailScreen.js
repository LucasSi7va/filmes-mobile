
import React from "react";
import { View, Button, StyleSheet } from "react-native";
import MovieDetail from "../components/MovieDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../components/Themecontext";

const MovieDetailScreen = ({ route, navigation }) => {
  const { movie } = route.params; // Supondo que os detalhes do filme sejam passados via parâmetros
  const { isDarkMode } = useTheme();

  const addToFavorites = async () => {
    const storedFavorites = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
    const isAlreadyFavorite = storedFavorites.some((fav) => fav.id === movie.id);

    if (!isAlreadyFavorite) {
      storedFavorites.push(movie);
      await AsyncStorage.setItem("favorites", JSON.stringify(storedFavorites));
      alert("Filme adicionado aos favoritos!");
    } else {
      alert("Este filme já está nos favoritos!");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#eee" }]}>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
      <MovieDetail movie={movie} />
     
    </View>
  );
};

export default MovieDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});