import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Lógica de login aqui
    console.log("Login:", email, password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo e nome do app */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/nuvio.png")}
            style={styles.logo}
          />
          <Text style={styles.appName}>Nuvio</Text>
        </View>

        {/* Botão de login com Google */}
        <TouchableOpacity style={styles.googleButton}>
          <FontAwesome name="google" size={20} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Continuar com Google</Text>
        </TouchableOpacity>

        {/* Divisor */}
        <Text style={styles.dividerText}>Ou entre com</Text>

        {/* Campo de email */}
        <TextInput
          style={styles.input}
          placeholder="fulanosilva@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Campo de senha */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="*******"
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

        {/* Lembre-se e Esqueceu senha */}
        <View style={styles.optionsRow}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
            />
            <Text style={styles.checkboxLabel}>Lembre-se</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.link}>Esqueceu a senha ?</Text>
          </TouchableOpacity>
        </View>

        {/* Link de acesso anônimo */}
        <View style={styles.anonymousRow}>
          <Text style={styles.anonymousText}>
            Deseja Entrar como usuário anônimo?{" "}
          </Text>
          <TouchableOpacity>
            <Text style={styles.link}>Acesse Aqui</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de Entrar */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Link de cadastro */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Ainda não possui conta? </Text>
          <TouchableOpacity>
            <Text style={styles.link}>Cadastre-se</Text>
          </TouchableOpacity>
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
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1755b2",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  dividerText: {
    textAlign: "center",
    color: "#999",
    marginBottom: 20,
    fontSize: 14,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#999",
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#4a7cff",
    borderColor: "#4a7cff",
  },
  checkboxLabel: {
    color: "#666",
    fontSize: 14,
  },
  link: {
    color: "#4a7cff",
    fontSize: 14,
    fontWeight: "500",
  },
  anonymousRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    flexWrap: "wrap",
  },
  anonymousText: {
    color: "#666",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#4a7cff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#666",
    fontSize: 14,
  },
});
