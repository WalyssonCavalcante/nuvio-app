import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
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

type Mood = "feliz" | "calmo" | "relaxado" | "raiva" | "triste" | null;

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<Mood>(null);

  const moods = [
    {
      id: "feliz",
      image: require("../../assets/moods/Happy.png"),
      label: "Feliz",
      color: "#E91E63",
    },
    {
      id: "calmo",
      image: require("../../assets/moods/Calm.png"),
      label: "Calmo",
      color: "#9C27B0",
    },
    {
      id: "relaxado",
      image: require("../../assets/moods/Relax.png"),
      label: "Relaxado",
      color: "#4DD0E1",
    },
    {
      id: "raiva",
      image: require("../../assets/moods/Angry.png"),
      label: "Raiva",
      color: "#FF9800",
    },
    {
      id: "triste",
      image: require("../../assets/moods/Sad.png"),
      label: "Triste",
      color: "#8BC34A",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Image
              source={require("../../assets/nuvio.png")}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <FontAwesome name="bell" size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Saudação */}
        <Text style={styles.greeting}>Boa Tarde!</Text>

        {/* Pergunta de humor */}
        <Text style={styles.question}>Como você está se sentindo hoje?</Text>

        {/* Seletor de humor */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.moodContainer}
        >
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodButton,
                { backgroundColor: mood.color },
                selectedMood === mood.id && styles.moodButtonSelected,
              ]}
              onPress={() => setSelectedMood(mood.id as Mood)}
            >
              <Image source={mood.image} style={styles.moodImage} />
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Card Diário Emocional */}
        <TouchableOpacity style={styles.diaryCard}>
          <View style={styles.diaryContent}>
            <Text style={styles.diaryTitle}>Diário Emocional</Text>
            <Text style={styles.diarySubtitle}>Hoje eu me escuto</Text>
            <View style={styles.diaryAction}>
              <Text style={styles.diaryActionText}>Faça Agora</Text>
              <MaterialCommunityIcons
                name="calendar-edit"
                size={20}
                color="#FF6B35"
              />
            </View>
          </View>
          <MaterialCommunityIcons name="hand-heart" size={48} color="#5D4037" />
        </TouchableOpacity>

        {/* Card Artigos */}
        <Link href="/articles" asChild>
          <TouchableOpacity style={styles.articleCard}>
            <FontAwesome
              name="newspaper-o"
              size={24}
              style={styles.articleIcon}
            />
            <Text style={styles.articleText}>Artigos</Text>
          </TouchableOpacity>
        </Link>

        {/* Card Citação */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>
            "É melhor conquistar a si mesmo do que vencer mil batalhas."
          </Text>
          <FontAwesome name="headphones" size={24} style={styles.quoteIcon} />
        </View>

        {/* Card Respiração Guiada */}
        <Link href="/breathing" asChild>
          <TouchableOpacity style={styles.breathingCard}>
            <Text style={styles.breathingTitle}>Respiração Guiada</Text>
            <Text style={styles.breathingSubtitle}>
              Encontre calma em cada respiração
            </Text>
            <MaterialCommunityIcons
              name="leaf"
              size={48}
              style={styles.breathingEmoji}
            />
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#6C63FF",
  },
  notificationButton: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#6C63FF",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  greeting: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  question: {
    fontSize: 16,
    color: "#666",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  moodContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  moodButton: {
    width: 80,
    height: 100,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  moodButtonSelected: {
    borderWidth: 3,
    borderColor: "#333",
  },
  moodImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
    resizeMode: "contain",
  },
  moodLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  diaryCard: {
    backgroundColor: "#FFE8D6",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  diaryContent: {
    flex: 1,
  },
  diaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5D4037",
    marginBottom: 4,
  },
  diarySubtitle: {
    fontSize: 14,
    color: "#795548",
    marginBottom: 12,
  },
  diaryAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  diaryActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B35",
    marginRight: 8,
  },
  articleCard: {
    backgroundColor: "#E8E8E8",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  articleIcon: {
    marginRight: 12,
    color: "#333",
  },
  articleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  quoteCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quoteText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 20,
  },
  quoteIcon: {
    marginLeft: 12,
    color: "#666",
  },
  breathingCard: {
    backgroundColor: "#81C784",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20, // Adjusted margin for scroll view
    position: "relative",
  },
  breathingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  breathingSubtitle: {
    fontSize: 14,
    color: "#fff",
  },
  breathingEmoji: {
    position: "absolute",
    bottom: 20,
    right: 20,
    color: "#fff",
    opacity: 0.8,
  },
});
