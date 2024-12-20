import { Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MovieList = ({ movies }) => {
  const navigation = useNavigation();

  const handleMoviePress = (movieId) => {
    navigation.navigate("MovieDetail", { id: movieId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMoviePress(item.id)} style={styles.movieItem}>
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "https://via.placeholder.com/500x750?text=Sem+Imagem", 
        }}
        style={styles.movieImage}
      />
      <Text style={styles.movieTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  movieItem: {
    flexDirection: "row", 
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center", 
  },
  movieImage: {
    width: 60, 
    height: 90, 
    borderRadius: 4, 
    marginRight: 10, 
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MovieList;
