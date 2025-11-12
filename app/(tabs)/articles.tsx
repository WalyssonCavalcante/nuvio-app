import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

export interface Article {
  id: number;
  title: string;
  image: any;
  content: string; // Adicionado para passar para a tela de detalhes
  category?: string;
}

const FAVORITES_STORAGE_KEY = "@NuvioApp:favorites";

// Exportando os dados para que a tela de detalhes possa usá-los
export const articles: Article[] = [
  {
    id: 1,
    title: "7 hábitos diários que ajudam a reduzir a ansiedade",
    image: require("../../assets/articles/article1.png"),
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: 2,
    title: "Alimentação e o bem-estar: o que podem ajudar ou prejudicar",
    image: require("../../assets/articles/article2.png"),
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

export const professionalArticles: Article[] = [
  {
    id: 3,
    title: "Ansiedade ou estresse? Como diferenciar e lidar com cada um",
    image: require("../../assets/articles/article3.png"),
    category: "Artigos de profissionais",
    content:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    id: 4,
    title: "Crise de ansiedade: o que fazer no momento em que ela acontece",
    image: require("../../assets/articles/article4.png"),
    content:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
  },
  {
    id: 5,
    title: "Pensamentos acelerados: técnicas simples para desacelerar a mente",
    image: require("../../assets/articles/article5.png"),
    content:
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  },
];

interface ArticleCardProps {
  article: Article;
  isLarge?: boolean;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
}

function ArticleCard({
  article,
  isLarge = false,
  isFavorited,
  onToggleFavorite,
}: ArticleCardProps) {
  const scale = useSharedValue(1);

  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleFavoritePress = () => {
    onToggleFavorite(article.id.toString());
    if (!isFavorited) {
      scale.value = withSequence(withSpring(1.4), withSpring(1));
    }
  };

  return (
    <View style={[styles.articleCard, isLarge && styles.articleCardLarge]}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/article-detail",
            params: { id: article.id },
          })
        }
      >
        <Image source={article.image} style={styles.articleImage} />
      </TouchableOpacity>
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{article.title}</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <Animated.View style={animatedHeartStyle}>
            <MaterialCommunityIcons
              name={isFavorited ? "heart" : "heart-outline"}
              size={24}
              color={isFavorited ? "#FF4444" : "#999"}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ArticlesScreen() {
  const categories = ["Ansiedade", "Depressão", "Autoestima", "Estresse"];
  const [selectedCategory, setSelectedCategory] = useState("Ansiedade");
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Carrega os favoritos ao focar na tela
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const storedFavorites = await AsyncStorage.getItem(
            FAVORITES_STORAGE_KEY
          );
          setFavoriteIds(storedFavorites ? JSON.parse(storedFavorites) : []);
        } catch (e) {
          console.error("Falha ao carregar favoritos.", e);
        }
      };
      loadFavorites();
    }, [])
  );

  const handleToggleFavorite = async (id: string) => {
    try {
      const newIsFavorited = !favoriteIds.includes(id);
      const newFavorites = newIsFavorited
        ? [...favoriteIds, id]
        : favoriteIds.filter((favId) => favId !== id);

      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(newFavorites)
      );
      setFavoriteIds(newFavorites);
    } catch (e) {
      console.error("Falha ao salvar favorito.", e);
    }
  };

  const allArticles = [...articles, ...professionalArticles];
  const filteredArticles = allArticles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeatured = filteredArticles.filter((a) => !a.category);
  const filteredProfessional = filteredArticles.filter((a) => !!a.category);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/(tabs)/favorites")}
          >
            <MaterialCommunityIcons
              name="heart-multiple-outline"
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        {/* Título */}
        <Text style={styles.title}>Cuidando da Mente</Text>
        <Text style={styles.subtitle}>
          Conteúdos simples e práticos para apoiar sua saúde mental no dia a dia
        </Text>

        {/* Barra de Busca */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={22} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar artigos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categorias */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryButton}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
              {selectedCategory === category && (
                <View style={styles.categoryIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Artigos em destaque */}
        <View style={styles.featuredSection}>
          {filteredFeatured.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isLarge
              isFavorited={favoriteIds.includes(article.id.toString())}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </View>

        {/* Artigos de profissionais */}
        <Text style={styles.sectionTitle}>Artigos de profissionais</Text>
        <View style={styles.professionalSection}>
          {filteredProfessional.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isFavorited={favoriteIds.includes(article.id.toString())}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 20,
    marginTop: 8,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    position: "relative",
  },
  categoryText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#333",
    fontWeight: "600",
  },
  categoryIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#FF4444",
    borderRadius: 2,
  },
  featuredSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  professionalSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
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
  articleCardLarge: {
    minHeight: 200,
  },
  articleImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  articleContent: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  articleTitle: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    lineHeight: 20,
    flex: 1,
    paddingRight: 10,
  },
  favoriteButton: {
    padding: 4,
  },
});
