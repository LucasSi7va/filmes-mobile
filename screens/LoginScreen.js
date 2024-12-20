import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as LocalAuthentication from "expo-local-authentication";

// Dados mockados para o login
const mockUserData = {
  username: "user",
  password: "123",
};

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    // Solicitar permissão para notificações quando o componente for montado
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Não foi possível enviar notificações.");
      }
    };
    requestPermissions();
  }, []);

  // Função para autenticação facial
  const handleFaceRecognition = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      Alert.alert("Erro", "O dispositivo não suporta autenticação biométrica.");
      return;
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      Alert.alert("Erro", "Nenhuma biometria registrada encontrada.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autentique-se usando seu rosto",
      fallbackLabel: "Usar senha",
    });

    if (result.success) {
      // Autenticação facial bem-sucedida
      triggerNotification();
      navigation.navigate("Main"); // Navega para o DrawerNavigator
    } else {
      Alert.alert("Erro", "Falha na autenticação facial.");
    }
  };

  // Função para login com usuário e senha
  const handleLogin = () => {
    if (username === mockUserData.username && password === mockUserData.password) {
      triggerNotification();
      navigation.navigate("Main"); // Navega para o DrawerNavigator
    } else {
      Alert.alert("Erro", "Usuário ou senha inválidos.");
    }
  };

  const triggerNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Bem-vindo!",
        body: "Você fez login com sucesso.",
        data: { user: username },
      },
      trigger: { seconds: 1 },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={handleFaceRecognition}>
        <Text style={styles.buttonText}>Login com Reconhecimento Facial</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F4F4F4", // Cor de fundo mais suave
  },
  title: {
    fontSize: 28, // Tamanho maior para destaque
    fontWeight: "700", // Peso de fonte mais forte
    marginBottom: 40,
    color: "#333", // Cor de texto mais escura para contraste
    textAlign: "center", // Centraliza o título
  },
  input: {
    width: "100%",
    maxWidth: 400, // Limita a largura do campo de entrada
    padding: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12, // Borda arredondada para suavizar
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
    elevation: 1, // Sombra suave
  },
  button: {
    backgroundColor: "#007BFF", // Cor de fundo vibrante para o botão
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8, // Bordas arredondadas para o botão
    marginVertical: 10, // Espaçamento entre os botões
    alignItems: "center",
    width: "100%", // Botão ocupa toda a largura disponível
    maxWidth: 400, // Limita a largura máxima
  },
  buttonSecondary: {
    backgroundColor: "#28a745", // Cor verde para o botão de login com biometria
  },
  buttonText: {
    color: "#fff", // Texto branco para contraste
    fontSize: 16,
    fontWeight: "600", // Peso de fonte mais forte
  },
});

export default LoginScreen;

