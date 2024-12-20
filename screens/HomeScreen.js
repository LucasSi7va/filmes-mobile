import { useState } from "react";
import { View, StyleSheet } from "react-native";
import SearchBar from "../components/Searchbar";
import MovieList from "../components/MovieList";
import { getMoviesByGenre, searchMovies } from "../services/Tmdb";
import { useTheme } from "../components/Themecontext";

const HomeScreen= () => {
  const [movies, setMovies] = useState([]);
  const { isDarkMode } = useTheme();

  const handleSearch = async ({ genres, query }) => {
    let results = [];
    if (genres.length) {
      const genreParams = genres.join(",");
      const genreMovies = await getMoviesByGenre(genreParams);
      results = genreMovies;
    }
    if (query) {
      const searchedMovies = await searchMovies(query);
      results = results.length
        ? results.filter((movie) =>
            searchedMovies.some((sm) => sm.id === movie.id)
          )
        : searchedMovies;
    }
    setMovies(results);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#eee" }]}>
      <SearchBar onSearch={handleSearch} />
      <MovieList movies={movies} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
