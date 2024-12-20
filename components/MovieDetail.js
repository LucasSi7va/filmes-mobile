// Ajuste do componente MovieDetail para lidar com favoritos
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { getMovieDetails } from "../services/Tmdb";
import { useTheme } from "../components/Themecontext";

const MovieDetail = () => {
  const { params } = useRoute();
  const { id } = params; // Recebe o ID do filme pela navegação
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieData = await getMovieDetails(id);
        setMovie(movieData);
        await addToHistory(movieData);
        checkIfFavorite(movieData.id);
      } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const addToHistory = async (movie) => {
    try {
      const history = JSON.parse(await AsyncStorage.getItem("history")) || [];
      if (!history.some((m) => m.id === movie.id)) {
        history.push({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
        });
        await AsyncStorage.setItem("history", JSON.stringify(history));
      }
    } catch (error) {
      console.error("Erro ao salvar histórico:", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      if (isFavorite) {
        // Remover dos favoritos
        const updatedFavorites = favorites.filter((fav) => fav.id !== movie.id);
        await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        setIsFavorite(false);
      } else {
        // Adicionar aos favoritos
        favorites.push({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
        });
        await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
    }
  };

  const checkIfFavorite = async (movieId) => {
    try {
      const favorites = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      setIsFavorite(favorites.some((fav) => fav.id === movieId));
    } catch (error) {
      console.error("Erro ao verificar favoritos:", error);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: isDarkMode ? "#121212" : "#fff" },
        ]}
      >
        <ActivityIndicator size="large" color={isDarkMode ? "#fff" : "#0000ff"} />
        <Text style={[styles.loadingText, { color: isDarkMode ? "#fff" : "#000" }]}>Carregando detalhes do filme...</Text>
      </View>
    );
  }

  const trailer = movie?.videos?.results?.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDarkMode ? "#333" : "#eee" },
      ]}
    >
      <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>{movie.title}</Text>
      <Image
        source={{
          uri: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=Sem+Imagem",
        }}
        style={styles.poster}
      />
      <Text style={[styles.overview, { color: isDarkMode ? "#ddd" : "#555" }]}>
        {movie.overview || "Descrição indisponível."}
      </Text>
      <Text style={[styles.label, { color: isDarkMode ? "#ccc" : "#444" }]}>
        <Text style={[styles.bold, { color: isDarkMode ? "#fff" : "#000" }]}>Gêneros:</Text>{" "}
        {movie.genres.map((g) => g.name).join(", ")}
      </Text>
      <Text style={[styles.label, { color: isDarkMode ? "#ccc" : "#444" }]}>
        <Text style={[styles.bold, { color: isDarkMode ? "#fff" : "#000" }]}>Avaliação:</Text>{" "}
        {movie.vote_average || "N/A"}
      </Text>
      {trailer ? (
        <View style={styles.trailerContainer}></View>
      ) : (
        <Text style={[styles.label, { color: isDarkMode ? "#ccc" : "#444" }]}>Trailer não disponível.</Text>
      )}

      <TouchableOpacity
        onPress={toggleFavorite}
        style={[styles.favoriteButton, { backgroundColor: isFavorite ? "#ff6b6b" : "#6b6bff" }]}
      >
        <Text style={styles.favoriteButtonText}>{isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MovieDetail;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  poster: {
    width: "100%",
    height: 400,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: "cover",
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  trailerContainer: {
    marginTop: 16,
    height: 250,
  },
  favoriteButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  favoriteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
