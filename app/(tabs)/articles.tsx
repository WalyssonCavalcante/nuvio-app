import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Article {
  id: number;
  title: string;
  image: any;
  category?: string;
}

export default function ArticlesScreen() {
  const categories = ["Ansiedade", "Depressão", "Autoestima", "Estresse"];
  const [selectedCategory, setSelectedCategory] = useState("Ansiedade");

  const articles: Article[] = [
    {
      id: 1,
      title: "7 hábitos diários que ajudam a reduzir a ansiedade",
      image: require("../../assets/articles/article1.png"),
    },
    {
      id: 2,
      title: "Alimentação e o bem-estar: o que podem ajudar ou prejudicar",
      image: require("../../assets/articles/article2.png"),
    },
  ];

  const professionalArticles: Article[] = [
    {
      id: 3,
      title: "Ansiedade ou estresse? Como diferenciar e lidar com cada um",
      image: require("../../assets/articles/article3.png"),
      category: "Artigos de profissionais",
    },
    {
      id: 4,
      title: "Crise de ansiedade: o que fazer no momento em que ela acontece",
      image: require("../../assets/articles/article4.png"),
    },
    {
      id: 5,
      title:
        "Pensamentos acelerados: técnicas simples para desacelerar a mente",
      image: require("../../assets/articles/article5.png"),
    },
    {
      id: 6,
      title:
        "Exercícios de mindfulness para controlar a ansiedade em poucos minutos",
      image: require("../../assets/articles/article6.png"),
    },
    {
      id: 7,
      title: "Quando procurar ajuda profissional para ansiedade?",
      image: require("../../assets/articles/article7.png"),
    },
  ];

  const renderArticleCard = (article: Article, isLarge: boolean = false) => (
    <TouchableOpacity
      key={article.id}
      style={[styles.articleCard, isLarge && styles.articleCardLarge]}
    >
      <Image source={article.image} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{article.title}</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <MaterialCommunityIcons name="heart-outline" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
          <TouchableOpacity>
            <Image
              source={require("../../assets/nuvio.png")}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        {/* Título */}
        <Text style={styles.title}>Cuidando da Mente</Text>
        <Text style={styles.subtitle}>
          Conteúdos simples e práticos para apoiar sua saúde mental no dia a dia
        </Text>

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
          {articles.map((article) => renderArticleCard(article, true))}
        </View>

        {/* Artigos de profissionais */}
        <Text style={styles.sectionTitle}>Artigos de profissionais</Text>
        <View style={styles.professionalSection}>
          {professionalArticles.map((article) => renderArticleCard(article))}
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
