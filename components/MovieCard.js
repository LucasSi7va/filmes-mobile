import React, { useState, useEffect } from "react";
import { Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MovieCard = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (movie && movie.id) { // Verifica se o movie e o id existem
      const checkFavorite = async () => {
        const favs = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
        setIsFavorite(favs.includes(movie.id)); // Verifica se o id do filme está nos favoritos
      };
      checkFavorite();
    }
  }, [movie]);

  const toggleFavorite = async () => {
    if (!movie || !movie.id) return; // Garantir que o movie e id existem antes de continuar

    const favs = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
    if (isFavorite) {
      const updatedFavs = favs.filter((favId) => favId !== movie.id); // Remove o id do filme
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavs));
      setIsFavorite(false);
    } else {
      favs.push(movie.id); // Adiciona o id do filme
      await AsyncStorage.setItem("favorites", JSON.stringify(favs));
      setIsFavorite(true);
    }
  };

  // Verifica se o objeto `movie` existe e tem o `poster_path`
  const posterUrl = movie && movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : "https://via.placeholder.com/200x300?text=Sem+Imagem";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => movie && movie.id && navigation.navigate("MovieDetails", { movieId: movie.id })}
    >
      <Image source={{ uri: posterUrl }} style={styles.poster} />
      <Text style={styles.title}>{movie ? movie.title : "Filme desconhecido"}</Text>
      
    </TouchableOpacity>
  );
};

export default MovieCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 4,
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  favoriteButton: {
    padding: 8,
  },
});
