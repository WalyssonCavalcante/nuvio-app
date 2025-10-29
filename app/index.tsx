import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    // Aguarda 2 segundos e navega para a tela de login
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 2000); // 2000ms = 2 segundos

    // Limpa o timer se o componente for desmontado
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Image
          source={require("../assets/nuvio.png")}
          style={styles.cloudIcon}
        />
      </View>
      <Text style={styles.appName}>Nuvio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  iconWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cloudIcon: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#034296",
    marginBottom: 30,
  },
});
