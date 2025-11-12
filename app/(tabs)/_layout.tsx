import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="diary" />
      <Stack.Screen name="articles" />
      <Stack.Screen name="article-detail" />
      <Stack.Screen name="breathing" />
    </Stack>
  );
}
