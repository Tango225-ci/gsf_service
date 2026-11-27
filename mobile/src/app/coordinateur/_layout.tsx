import { Stack } from 'expo-router';

/** Partie coordinateur : les onglets, plus les écrans qui s'ouvrent par-dessus. */
export default function LayoutCoordinateur() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
