import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const DIARY_STORAGE_KEY = "@NuvioApp:diaryEntries";

interface DiaryEntry {
  mood: string | null;
  text: string;
}

type DiaryData = {
  [date: string]: DiaryEntry;
};

type MarkedDates = {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
};

export default function DiaryScreen() {
  const params = useLocalSearchParams<{ mood: string }>();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [diaryEntries, setDiaryEntries] = useState<DiaryData>({});
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [diaryText, setDiaryText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [wasEditing, setWasEditing] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (params.mood) {
      setSelectedMood(params.mood);
    }
  }, [params.mood]);

  useEffect(() => {
    // Limpa o erro de validação assim que um humor é selecionado
    if (selectedMood) setValidationError(null);
  }, [selectedMood]);

  // Carrega todas as entradas do diário do AsyncStorage na inicialização
  useEffect(() => {
    const loadDiaryEntries = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(DIARY_STORAGE_KEY);
        if (jsonValue != null) {
          setDiaryEntries(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Falha ao carregar as entradas do diário.", e);
      }
    };
    loadDiaryEntries();
  }, []);

  // Atualiza a tela quando uma nova data é selecionada
  useEffect(() => {
    const entry = diaryEntries[selectedDate];
    setSelectedMood(entry?.mood || null);
    setDiaryText(entry?.text || "");
    // Reseta o estado de "salvo" ao mudar de dia
    setIsSaved(false);
    // Reseta o estado de "deletado" ao mudar de dia
    setIsDeleted(false);
    // Reseta o foco ao mudar de dia
    setIsInputFocused(false);
  }, [selectedDate, diaryEntries]);

  const moods = [
    {
      id: "feliz",
      image: require("../assets/moods/Happy.png"),
      label: "Feliz",
      color: "#E91E63",
    },
    {
      id: "calmo",
      image: require("../assets/moods/Calm.png"),
      label: "Calmo",
      color: "#9C27B0",
    },
    {
      id: "relaxado",
      image: require("../assets/moods/Relax.png"),
      label: "Relaxado",
      color: "#4DD0E1",
    },
    {
      id: "raiva",
      image: require("../assets/moods/Angry.png"),
      label: "Raiva",
      color: "#FF9800",
    },
    {
      id: "triste",
      image: require("../assets/moods/Sad.png"),
      label: "Triste",
      color: "#8BC34A",
    },
  ];

  const selectedMoodColor =
    moods.find((mood) => mood.id === selectedMood)?.color || "#1755b2";

  const encouragementMessages: { [key: string]: string } = {
    feliz: "Que bom te ver feliz! Guarde essa sensação.",
    calmo: "A calma é um refúgio. Descreva sua paz.",
    relaxado: "Relaxe e deixe fluir. Todos os sentimentos são válidos.",
    raiva: "Sua raiva é válida. Escrever pode ajudar a processá-la.",
    triste: "Você merece acolhimento. Compartilhe como se sente.",
  };

  const generateMarkedDates = (): MarkedDates => {
    const marked: MarkedDates = {};

    // Adiciona pontos para cada entrada do diário
    for (const date in diaryEntries) {
      // Agora usa os dados do estado
      const entry = diaryEntries[date];
      const moodData = moods.find((m) => m.id === entry.mood);
      if (moodData) {
        marked[date] = {
          marked: true,
          dotColor: moodData.color,
        };
      }
    }

    // Marca a data atualmente selecionada
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: selectedMoodColor,
    };

    return marked;
  };

  const handleSave = async () => {
    if (!selectedMood) {
      setValidationError("Por favor, selecione um humor.");
      // Animação de "tremor"
      moodsContainerTranslateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withRepeat(withTiming(20, { duration: 100 }), 3, true),
        withTiming(0, { duration: 50 })
      );
      return;
    }

    // Verifica se já existia uma entrada para determinar a mensagem de sucesso
    setWasEditing(entryExists);

    const newEntry: DiaryEntry = { mood: selectedMood, text: diaryText };
    const updatedEntries = {
      ...diaryEntries,
      [selectedDate]: newEntry,
    };

    try {
      const jsonValue = JSON.stringify(updatedEntries);
      await AsyncStorage.setItem(DIARY_STORAGE_KEY, jsonValue);
      setDiaryEntries(updatedEntries); // Atualiza o estado local
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500); // Mostra a mensagem de sucesso
    } catch (e) {
      console.error("Falha ao salvar a entrada do diário.", e);
      alert("Ocorreu um erro ao salvar sua anotação.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Deletar Anotação",
      "Você tem certeza que deseja deletar a anotação para este dia?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
          style: "destructive",
          // Se o usuário confirmar, executa a exclusão
          onPress: async () => {
            const updatedEntries = { ...diaryEntries };
            delete updatedEntries[selectedDate];

            try {
              const jsonValue = JSON.stringify(updatedEntries);
              await AsyncStorage.setItem(DIARY_STORAGE_KEY, jsonValue);
              setDiaryEntries(updatedEntries); // Atualiza o estado, o que vai limpar os campos via useEffect
              setIsDeleted(true); // Mostra a mensagem de sucesso
              setTimeout(() => setIsDeleted(false), 2500);
            } catch (e) {
              console.error("Falha ao deletar a entrada do diário.", e);
              alert("Ocorreu um erro ao deletar sua anotação.");
            }
          },
        },
      ]
    );
  };

  const encouragementOpacity = useSharedValue(0);
  const savedMessageOpacity = useSharedValue(0);

  // Animação para a mensagem de incentivo
  const encouragementAnimatedStyle = useAnimatedStyle(() => {
    // O hook é chamado incondicionalmente. A lógica fica dentro.
    encouragementOpacity.value = withTiming(selectedMood ? 1 : 0, {
      duration: 300,
    });
    return {
      opacity: encouragementOpacity.value,
    };
  });

  // Animação para a mensagem de "Salvo"
  const savedMessageAnimatedStyle = useAnimatedStyle(() => {
    return { opacity: withTiming(isSaved ? 1 : 0, { duration: 300 }) };
  });

  // Animação de erro para o container de humor
  const moodsContainerTranslateX = useSharedValue(0);
  const moodsContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: moodsContainerTranslateX.value }],
    };
  });

  const entryExists = !!diaryEntries[selectedDate];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            {/* Calendário para seleção de datas */}
            <View style={styles.calendarWrapper}>
              <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={generateMarkedDates()}
                monthFormat={"MMMM"}
                hideExtraDays={true}
                style={styles.calendar}
                theme={{
                  selectedDayBackgroundColor: selectedMoodColor,
                  todayTextColor: "#1755b2",
                  monthTextColor: "#333",
                  textDayFontWeight: "500",
                  textMonthFontWeight: "bold",
                }}
              />
            </View>

            {/* Seletor de humor */}
            <Text style={styles.question}>
              Como você está se sentindo hoje?
            </Text>
            <Animated.View style={[moodsContainerAnimatedStyle]}>
              <View style={styles.moodsContainer}>
                {moods.map((mood) => (
                  <MoodButton
                    key={mood.id}
                    mood={mood}
                    isSelected={selectedMood === mood.id}
                    onPress={() => setSelectedMood(mood.id)}
                  />
                ))}
              </View>
              {validationError && (
                <Text style={styles.errorText}>{validationError}</Text>
              )}
            </Animated.View>

            {/* Mensagem de Incentivo */}
            <Animated.View
              style={[
                styles.encouragementContainer,
                encouragementAnimatedStyle,
              ]}
            >
              <Text style={styles.encouragementText}>
                {selectedMood ? encouragementMessages[selectedMood] : " "}
              </Text>
            </Animated.View>

            {/* Caixa de texto do diário */}
            <View
              style={[
                styles.diaryCard,
                styles.cardShadow,
                isInputFocused && {
                  borderColor: selectedMoodColor,
                  borderWidth: 1.5,
                },
              ]}
            >
              <TextInput
                style={styles.diaryInput}
                placeholder="Escreva sobre o seu dia..."
                placeholderTextColor="#A08C7D" // Corrigido para ser uma string
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                value={diaryText}
                onChangeText={setDiaryText}
                multiline
              />
            </View>

            {/* Mensagem de "Salvo" */}
            <Animated.View
              style={[styles.savedMessageContainer, savedMessageAnimatedStyle]}
            >
              <Text style={styles.savedMessageText}>
                {isDeleted
                  ? "Anotação deletada!"
                  : wasEditing
                  ? "Anotação editada com sucesso!"
                  : "Sentimento registrado!"}
              </Text>
            </Animated.View>
          </View>
        </ScrollView>

        {/* Container dos Botões de Ação (agora fora do ScrollView) */}
        <View style={styles.actionButtonsContainer}>
          {entryExists && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={22}
                color="#D32F2F"
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.writeButtonText}>
              {entryExists ? "Editar" : "Salvar"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface MoodButtonProps {
  mood: { id: string; image: any; label: string; color: string };
  isSelected: boolean;
  onPress: () => void;
}

function MoodButton({ mood, isSelected, onPress }: MoodButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      borderColor: isSelected ? mood.color : "transparent",
    };
  });

  useEffect(() => {}, [isSelected, scale]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View
        style={[
          styles.moodButton,
          animatedStyle,
          isSelected && styles.moodButtonSelected,
        ]}
      >
        <Image source={mood.image} style={styles.moodImage} />
        <Text style={styles.moodLabel}>{mood.label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarWrapper: {
    alignItems: "center",
    marginTop: 60, // Aumentado para dar espaço ao botão de voltar
    marginBottom: 0,
  },
  calendar: {
    width: "90%",
    backgroundColor: "#fff",
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: "#805D4B",
    marginHorizontal: 18,
    marginTop: 24,
    marginBottom: 10,
  },
  moodsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 18,
    marginBottom: 16,
    gap: 8,
  },
  moodButton: {
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    width: 64,
    paddingVertical: 10,
    borderWidth: 2.5,
    borderColor: "transparent",
  },
  moodButtonSelected: {
    backgroundColor: "#f0f4ff",
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodImage: {
    width: 36,
    height: 36,
    marginBottom: 6,
    resizeMode: "contain",
  },
  moodLabel: {
    fontSize: 13,
    color: "#805D4B",
    fontWeight: "500",
  },
  diaryCard: {
    backgroundColor: "#feefd6",
    borderRadius: 12,
    marginHorizontal: 18,
    padding: 14,
    minHeight: 150,
    marginBottom: 24,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  diaryInput: {
    color: "#805D4B",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
    flex: 1,
    textAlignVertical: "top",
  },
  writeButton: {
    backgroundColor: "#222",
    marginHorizontal: 18,
    borderRadius: 8,
    marginBottom: 34,
    marginTop: 0,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  writeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  encouragementContainer: {
    marginHorizontal: 18,
    marginBottom: 16,
    alignItems: "center",
    minHeight: 20, // Garante que o layout não pule quando o texto aparece
  },
  encouragementText: {
    fontSize: 14,
    color: "#805D4B",
    fontStyle: "italic",
    textAlign: "center",
  },
  errorText: {
    color: "#D32F2F",
    textAlign: "center",
    marginHorizontal: 18,
    marginTop: -8,
    marginBottom: 10,
  },
  savedMessageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    minHeight: 24, // Garante que o layout não pule
  },
  savedMessageText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50", // Verde sucesso
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 18,
    paddingBottom: Platform.OS === "ios" ? 20 : 10, // Espaço extra para a "home bar" do iOS
    paddingTop: 10,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#222",
  },
  deleteButton: {
    paddingHorizontal: 16,
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
});
