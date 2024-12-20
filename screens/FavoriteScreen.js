import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MovieCard from "../components/MovieCard"; // Importe o componente MovieCard

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Carregar os filmes favoritos da AsyncStorage
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favs = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
        setFavorites(favs);
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      }
    };
    fetchFavorites();
  }, []);

  // Verifica se há filmes favoritos
  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Você ainda não adicionou filmes aos favoritos.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} // Verifica se id existe, senão usa o índice
      renderItem={({ item }) => <MovieCard movie={item} />} // Exibe os filmes favoritos como cards
      contentContainerStyle={styles.list}
    />
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  message: {
    fontSize: 16,
    color: "#555",
  },
  list: {
    padding: 16,
  },
});