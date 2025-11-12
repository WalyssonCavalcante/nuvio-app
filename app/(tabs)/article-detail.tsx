import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Em um app real, os dados viriam de uma API ou de um estado global (context, redux, etc.)
import { articles, professionalArticles } from "./articles";

const FAVORITES_STORAGE_KEY = "@NuvioApp:favorites";

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFavorited, setIsFavorited] = useState(false);

  const allArticles = [...articles, ...professionalArticles];
  const article = allArticles.find((a) => a.id.toString() === id);
  const scale = useSharedValue(1);

  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Carrega o estado de favorito do AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      if (!id) return;
      try {
        const storedFavorites = await AsyncStorage.getItem(
          FAVORITES_STORAGE_KEY
        );
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        setIsFavorited(favorites.includes(id));
      } catch (e) {
        console.error("Falha ao carregar favoritos.", e);
      }
    };
    loadFavorites();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!id) return;
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      const newIsFavorited = !isFavorited;

      favorites = newIsFavorited
        ? [...favorites, id]
        : favorites.filter((favId: string) => favId !== id);

      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favorites)
      );
      setIsFavorited(newIsFavorited);

      // Dispara a animação apenas ao favoritar
      if (newIsFavorited) {
        scale.value = withSequence(withSpring(1.4), withSpring(1));
      }
    } catch (e) {
      console.error("Falha ao salvar favorito.", e);
    }
  };

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.title}>Artigo não encontrado</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.notFoundLink}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Nav e Ilustração */}
        <View style={styles.heroImageSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={26} color="#333" />
          </TouchableOpacity>
          <Image
            source={article.image}
            style={styles.articleImage}
            resizeMode="contain"
          />
        </View>

        {/* Botão flutuante favoritar */}
        <TouchableOpacity
          style={styles.fabButton}
          onPress={handleToggleFavorite}
        >
          <Animated.View style={animatedHeartStyle}>
            <MaterialCommunityIcons
              name={isFavorited ? "heart" : "heart-outline"}
              color="#fff"
              size={32}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Título */}
        <Text style={styles.title}>{article.title}</Text>

        {/* Conteúdo do artigo */}
        <Text style={styles.content}>{article.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heroImageSection: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingTop: 16,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 20,
    padding: 6,
  },
  articleImage: {
    width: "100%",
    height: 160,
    marginTop: 12,
    marginBottom: 4,
  },
  fabButton: {
    position: "absolute",
    top: 170,
    right: 30,
    backgroundColor: "#FF4444",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    zIndex: 10,
    shadowColor: "#FF4444",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 1, height: 4 },
  },
  title: {
    marginTop: 48, // Aumentado para não ficar atrás do botão
    marginBottom: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    paddingHorizontal: 18,
  },
  content: {
    fontSize: 15,
    color: "#555",
    paddingHorizontal: 20,
    textAlign: "justify",
    marginBottom: 34,
    lineHeight: 22,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundLink: {
    marginTop: 16,
    color: "#FF4444",
    fontSize: 16,
  },
});
