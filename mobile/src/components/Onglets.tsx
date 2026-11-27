import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { couleurs } from '@/lib/theme';
import type { NomIcone } from './ui';

export interface Onglet {
  /** Nom du fichier de l'écran, dans le dossier du rôle. */
  nom: string;
  titre: string;
  icone: NomIcone;
}

/** Barre d'onglets commune aux trois rôles de l'app (client, agent, coordinateur). */
export function Onglets({ onglets }: { onglets: Onglet[] }) {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: couleurs.marque,
        tabBarInactiveTintColor: couleurs.discret,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: { borderTopColor: couleurs.bordure },
      }}
    >
      {onglets.map((o) => (
        <Tabs.Screen
          key={o.nom}
          name={o.nom}
          options={{ title: o.titre, tabBarIcon: ({ color, size }) => <Ionicons name={o.icone} size={size} color={color as string} /> }}
        />
      ))}
    </Tabs>
  );
}
