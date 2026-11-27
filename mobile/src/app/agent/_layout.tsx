import { Stack } from 'expo-router';

/** Partie agent : les onglets, plus les écrans qui s'ouvrent par-dessus. */
export default function LayoutAgent() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
