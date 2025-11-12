import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DURATION_OPTIONS = [
  { label: "1 Min", value: 60 },
  { label: "3 Min", value: 180 },
  { label: "5 Min", value: 300 },
  { label: "Sem Limite", value: Infinity },
];

export default function BreathingScreen() {
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "exhale">(
    "inhale"
  );
  const [isBreathing, setIsBreathing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [exerciseFinished, setExerciseFinished] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const encouragementOpacity = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const runAnimationCycle = () => {
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.3,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    animationRef.current.start();
  };

  useEffect(() => {
    // Efeito para controlar os timers (cronômetro, fases, mensagem) que devem ser pausados
    if (!isBreathing || isPaused) {
      animationRef.current?.stop();
      return;
    }

    runAnimationCycle();

    let countdownInterval: ReturnType<typeof setInterval> | null = null;
    if (selectedDuration !== Infinity) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsBreathing(false);
            setExerciseFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    const phaseInterval = setInterval(() => {
      setBreathingPhase((prev) => (prev === "inhale" ? "exhale" : "inhale"));
    }, 4000);

    const encouragementTimer = !showEncouragement
      ? setTimeout(() => {
          setShowEncouragement(true);
        }, 8000)
      : null;

    return () => {
      if (phaseInterval) clearInterval(phaseInterval);
      if (countdownInterval) clearInterval(countdownInterval);
      if (encouragementTimer) clearTimeout(encouragementTimer);
      animationRef.current?.stop();
    };
  }, [isBreathing, isPaused]);

  useEffect(() => {
    if (showEncouragement) {
      Animated.timing(encouragementOpacity, {
        toValue: 1,
        duration: 1000, // 1 segundo de fade-in
        useNativeDriver: true,
      }).start();
    } else {
      // Reseta a opacidade se a mensagem for escondida
      encouragementOpacity.setValue(0);
    }
  }, [showEncouragement]);

  const handleCancel = () => {
    setIsBreathing(false);
    setExerciseFinished(false);
    setSelectedDuration(null);
    setCountdown(0);
    setIsPaused(false);
    setShowEncouragement(false);
    // Reseta a animação para o estado inicial
    encouragementOpacity.setValue(0);
    scaleValue.setValue(1);
  };

  const handleStart = () => {
    if (selectedDuration) {
      setCountdown(selectedDuration);
      setIsBreathing(true);
      setExerciseFinished(false);
      setShowEncouragement(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>

      {!isBreathing && !exerciseFinished && (
        <>
          <Text style={styles.title}>Respiração Guiada</Text>
          <Text style={styles.subtitle}>Selecione a duração do exercício.</Text>
        </>
      )}

      {isBreathing && (
        <View style={styles.timerContainer}>
          {selectedDuration !== Infinity && (
            <Text style={styles.countdownText}>
              {String(Math.floor(countdown / 60)).padStart(2, "0")}:
              {String(countdown % 60).padStart(2, "0")}
            </Text>
          )}
          <Animated.View style={{ opacity: encouragementOpacity }}>
            <Text style={styles.encouragement}>
              Ótimo trabalho! Continue respirando fundo.
            </Text>
          </Animated.View>
        </View>
      )}

      {/* Círculo de respiração animado */}
      {isBreathing ? (
        <>
          <View style={styles.circleContainer}>
            <TouchableOpacity
              onPress={() => setIsPaused(!isPaused)}
              activeOpacity={1}
            >
              <Animated.View
                style={[
                  styles.breathingCircle,
                  {
                    transform: [{ scale: scaleValue }],
                  },
                ]}
              >
                <Text style={styles.breathingText}>
                  {isPaused
                    ? "Pausado"
                    : breathingPhase === "inhale"
                    ? "Inspire pelo nariz"
                    : "Expire devagar"}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        !exerciseFinished && (
          <View style={styles.setupContainer}>
            <View style={styles.durationContainer}>
              {DURATION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.durationButton,
                    selectedDuration === option.value &&
                      styles.durationButtonSelected,
                  ]}
                  onPress={() => setSelectedDuration(option.value)}
                >
                  <Text
                    style={[
                      styles.durationButtonText,
                      selectedDuration === option.value &&
                        styles.durationButtonTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[
                styles.startButton,
                !selectedDuration && styles.startButtonDisabled,
              ]}
              onPress={handleStart}
              disabled={!selectedDuration}
            >
              <Text style={styles.startButtonText}>Iniciar</Text>
            </TouchableOpacity>
          </View>
        )
      )}

      {exerciseFinished && (
        <View style={styles.finishedContainer}>
          <Text style={styles.finishedTitle}>Parabéns!</Text>
          <Text style={styles.finishedSubtitle}>
            Exercício de respiração concluído.
          </Text>
          <TouchableOpacity
            style={styles.finishedButton}
            onPress={() => router.back()}
          >
            <Text style={styles.finishedButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5DB5A6",
    paddingHorizontal: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginLeft: 10,
  },
  timerContainer: {
    alignItems: "center",
    marginTop: 20,
    minHeight: 50, // Garante espaço mesmo sem o timer
  },
  countdownText: {
    fontSize: 22,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  circleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80, // Adicionado para subir o círculo
  },
  breathingCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  breathingText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  encouragement: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  setupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  startButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 40,
  },
  durationButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 8,
    marginBottom: 10,
  },
  durationButtonSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  durationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  durationButtonTextSelected: {
    color: "#333",
  },
  finishedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  finishedTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  finishedSubtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 40,
  },
  finishedButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  finishedButtonText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButtonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
