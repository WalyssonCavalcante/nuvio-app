import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    // Lógica de cadastro aqui
    console.log("Cadastro:", {
      firstName,
      lastName,
      email,
      birthDate,
      password,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo e nome do app */}
        <View style={styles.logoContainer}>
          <Image source={require("../assets/nuvio.png")} style={styles.logo} />
          <Text style={styles.appName}>Nuvio</Text>
        </View>

        {/* Card do formulário */}
        <View style={styles.formCard}>
          {/* Campos de nome (lado a lado) */}
          <View style={styles.nameRow}>
            <TextInput
              style={[styles.input, styles.nameInput]}
              placeholder="Nome"
              placeholderTextColor="#999"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, styles.nameInput, { marginRight: 0 }]}
              placeholder="Sobrenome"
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Campo de email */}
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Campo de data de nascimento */}
          <View style={styles.dateContainer}>
            <TextInput
              style={styles.dateInput}
              placeholder="Data de Nascimento"
              placeholderTextColor="#999"
              value={birthDate}
              onChangeText={setBirthDate}
            />
            <MaterialCommunityIcons name="calendar" size={24} color="#999" />
          </View>

          {/* Campo de senha */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="*******"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Botão de Registrar */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Registrar</Text>
          </TouchableOpacity>

          {/* Botão de Google */}
          <TouchableOpacity style={styles.googleButton}>
            <FontAwesome name="google" size={20} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Conectar com Google</Text>
          </TouchableOpacity>

          {/* Link para login */}
          <View style={styles.loginLinkRow}>
            <Text style={styles.loginLinkText}>Já possui uma conta? </Text>
            <Link href="/login" asChild>
              <Text style={styles.link}>Faça login</Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1755b2",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  nameInput: {
    flex: 1,
    marginRight: 8,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dateInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#4a7cff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  googleIcon: {
    color: "#333",
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  loginLinkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginLinkText: {
    color: "#666",
    fontSize: 14,
  },
  link: {
    color: "#4a7cff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
});
