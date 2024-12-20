import axios from "axios";
import NetInfo from "@react-native-community/netinfo"; // Adiciona para verificar a conexão de rede

const API_KEY = "b861b99806c1aaa1c6f8b636986937fe"; // Substitua pela sua API Key
const BASE_URL = "https://api.themoviedb.org/3";

const Tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "pt-BR", // Configura para português
  },
});

// Função para verificar se o dispositivo está conectado à Internet
const checkNetworkConnection = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};

// Busca gêneros
export const getGenres = async () => {
  try {
    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      throw new Error("Sem conexão com a internet.");
    }
    const response = await Tmdb.get("/genre/movie/list");
    return response.data.genres;
  } catch (error) {
    console.error("Erro ao buscar gêneros:", error.message);
    return [];
  }
};

// Busca filmes por gênero
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      throw new Error("Sem conexão com a internet.");
    }
    const response = await Tmdb.get("/discover/movie", {
      params: {
        with_genres: genreId,
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Erro ao buscar filmes por gênero:", error.message);
    return [];
  }
};

// Busca detalhes do filme
export const getMovieDetails = async (movieId) => {
  try {
    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      throw new Error("Sem conexão com a internet.");
    }
    const response = await Tmdb.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "videos",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do filme:", error.message);
    return null;
  }
};

// Busca filmes por título
export const searchMovies = async (query, page = 1) => {
  try {
    const isConnected = await checkNetworkConnection();
    if (!isConnected) {
      throw new Error("Sem conexão com a internet.");
    }
    const response = await Tmdb.get("/search/movie", {
      params: {
        query,
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Erro ao buscar filmes:", error.message);
    return [];
  }
};
