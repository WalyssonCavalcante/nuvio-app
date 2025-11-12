import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Article, articles, professionalArticles } from "./articles";

import { SafeAreaView } from "react-native-safe-area-context";
const FAVORITES_STORAGE_KEY = "@NuvioApp:favorites";

export default function FavoritesScreen() {
  const [favoriteArticles, setFavoriteArticles] = useState<Article[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const storedFavorites = await AsyncStorage.getItem(
            FAVORITES_STORAGE_KEY
          );
          const favoriteIds = storedFavorites
            ? JSON.parse(storedFavorites)
            : [];
          const allArticles = [...articles, ...professionalArticles];
          const favs = allArticles.filter((article) =>
            favoriteIds.includes(article.id.toString())
          );
          setFavoriteArticles(favs);
        } catch (e) {
          console.error("Falha ao carregar favoritos.", e);
        }
      };
      loadFavorites();
    }, [])
  );

  const renderArticleCard = ({ item }: { item: Article }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() =>
        router.push({
          pathname: "/article-detail",
          params: { id: item.id },
        })
      }
    >
      <Image source={item.image} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Favoritos</Text>
        <View style={{ width: 40 }} />
      </View>

      {favoriteArticles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="heart-broken" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            Você ainda não tem artigos favoritos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteArticles}
          renderItem={renderArticleCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  listContainer: { padding: 20 },
  articleCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  articleImage: { width: "100%", height: 150, resizeMode: "cover" },
  articleContent: { padding: 16 },
  articleTitle: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
