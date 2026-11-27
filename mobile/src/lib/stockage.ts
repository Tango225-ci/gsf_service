import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/** Stockage du jeton : coffre sécurisé sur téléphone, stockage du navigateur sur le web (tests sur PC). */
export const stockage = {
  async lire(cle: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return globalThis.localStorage?.getItem(cle) ?? null;
      } catch {
        return null;
      }
    }
    return SecureStore.getItemAsync(cle);
  },
  async ecrire(cle: string, valeur: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        globalThis.localStorage?.setItem(cle, valeur);
      } catch {
        /* navigation privée : la session ne sera pas gardée */
      }
      return;
    }
    await SecureStore.setItemAsync(cle, valeur);
  },
  async supprimer(cle: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        globalThis.localStorage?.removeItem(cle);
      } catch {
        /* rien */
      }
      return;
    }
    await SecureStore.deleteItemAsync(cle);
  },
};
