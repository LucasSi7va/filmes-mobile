import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from "react-native";
import { getGenres } from "../services/Tmdb";
import { useTheme } from "../components/Themecontext";

const SearchBar = ({ onSearch }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchGenres = async () => {
      const genresData = await getGenres();
      setGenres(genresData);
    };
    fetchGenres();
  }, []);

  const toggleGenreSelection = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSearch = () => {
    onSearch({ genres: selectedGenres, query });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : "#eee" }]}>
      {/* Dropdown Button */}
      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.dropdownButton}>
        <Text style={styles.dropdownButtonText}>Gêneros</Text>
      </TouchableOpacity>

      {/* Modal for genre selection */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione os gêneros</Text>
            <FlatList
              data={genres}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleGenreSelection(item.id)}
                  style={styles.genreItem}
                >
                  <Text
                    style={[
                      styles.genreText,
                      selectedGenres.includes(item.id) && styles.selectedGenreText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Fechar" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>

      {/* Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Pesquisar por título..."
        placeholderTextColor={isDarkMode ? "#bbb" : "#666"} // Muda a cor do placeholder
        value={query}
        onChangeText={setQuery}
      />

      {/* Search Button */}
      <Button title="Buscar" onPress={handleSearch} style={styles.searchButton} />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    width: "100%", // Ensures the container takes the full width
  },
  dropdownButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  dropdownButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    maxHeight: "80%", // Prevent modal from being too tall
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  genreItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: "#f8f8f8",
  },
  genreText: {
    fontSize: 16,
    color: "#333",
  },
  selectedGenreText: {
    fontWeight: "bold",
    color: "#007bff",
  },
  searchButton: {
    width: "100%", // Ensures the button takes the full width
    marginTop: 10,
  },
});
