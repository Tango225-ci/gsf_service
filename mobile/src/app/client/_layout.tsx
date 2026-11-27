import { Stack } from 'expo-router';

/** Partie client : les onglets, plus les écrans qui s'ouvrent par-dessus. */
export default function LayoutClient() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onglets)" />
      <Stack.Screen name="nouvelle-demande" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
