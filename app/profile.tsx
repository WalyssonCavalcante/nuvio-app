import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const USER_PROFILE_KEY = "@NuvioApp:userProfile";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(USER_PROFILE_KEY);
        if (jsonValue) {
          const { name, avatarUri } = JSON.parse(jsonValue);
          setName(name || "Usuário");
          setAvatarUri(avatarUri);
        }
      } catch (e) {
        console.error("Falha ao carregar o perfil.", e);
      }
    };
    loadProfile();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para acessar sua galeria de fotos."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      const profile = { name, avatarUri };
      const jsonValue = JSON.stringify(profile);
      await AsyncStorage.setItem(USER_PROFILE_KEY, jsonValue);
      Alert.alert("Sucesso", "Seu perfil foi atualizado!");
      router.back();
    } catch (e) {
      console.error("Falha ao salvar o perfil.", e);
      Alert.alert("Erro", "Não foi possível salvar seu perfil.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          <Image
            source={
              avatarUri ? { uri: avatarUri } : require("../assets/nuvio.png")
            }
            style={styles.avatar}
          />
          <View style={styles.editIconContainer}>
            <MaterialCommunityIcons name="camera-plus" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 30,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#6C63FF",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6C63FF",
    borderRadius: 15,
    padding: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 30,
    fontSize: 16,
  },
  saveButton: {
    width: "100%",
    backgroundColor: "#4a7cff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
