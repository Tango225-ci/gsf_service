import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { couleurs, rayons } from '@/lib/theme';

export type NomIcone = ComponentProps<typeof Ionicons>['name'];

/** Fond d'écran commun, avec les marges de sécurité (encoche, barre d'état). */
export function Ecran({ titre, children }: { titre?: string; children: ReactNode }) {
  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      <ScrollView contentContainerStyle={styles.contenu}>
        {titre && <Text style={styles.titre}>{titre}</Text>}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Bouton({
  titre,
  onPress,
  variante = 'principal',
  chargement = false,
  desactive = false,
  icone,
  style,
}: {
  titre: string;
  onPress: () => void;
  variante?: 'principal' | 'secondaire';
  chargement?: boolean;
  desactive?: boolean;
  icone?: NomIcone;
  style?: StyleProp<ViewStyle>;
}) {
  const v = VARIANTES[variante];
  const inactif = desactive || chargement;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactif, busy: chargement }}
      onPress={onPress}
      disabled={inactif}
      style={({ pressed }) => [
        styles.bouton,
        { backgroundColor: v.fond, borderColor: v.bord, opacity: inactif ? 0.6 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {chargement ? (
        <ActivityIndicator color={v.texte} />
      ) : (
        <>
          {icone && <Ionicons name={icone} size={20} color={v.texte} />}
          <Text style={[styles.boutonTexte, { color: v.texte }]}>{titre}</Text>
        </>
      )}
    </Pressable>
  );
}

const VARIANTES = {
  principal: { fond: couleurs.marque, bord: couleurs.marque, texte: couleurs.surMarque },
  secondaire: { fond: couleurs.carte, bord: couleurs.marque, texte: couleurs.marque },
};

export function Carte({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.carte, style]}>{children}</View>;
}

export function Badge({ texte, fond = couleurs.marqueClair, couleur = couleurs.marque }: { texte: string; fond?: string; couleur?: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: fond }]}>
      <Text style={[styles.badgeTexte, { color: couleur }]}>{texte}</Text>
    </View>
  );
}

/** Écran prévu mais pas encore développé : indique le lot du MVP qui le construira. */
export function EcranAVenir({ titre, icone, description, lot }: { titre: string; icone: NomIcone; description: string; lot: string }) {
  return (
    <Ecran titre={titre}>
      <Carte style={styles.aVenir}>
        <Ionicons name={icone} size={36} color={couleurs.marque} />
        <Text style={styles.aVenirTexte}>{description}</Text>
        <Badge texte={`Prévu au ${lot}`} fond={couleurs.accentClair} couleur={couleurs.accent} />
      </Carte>
    </Ecran>
  );
}

export function Chargement() {
  return (
    <View style={styles.centre}>
      <ActivityIndicator size="large" color={couleurs.marque} />
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: couleurs.ecran },
  contenu: { padding: 16, gap: 14 },
  titre: { fontSize: 26, fontWeight: '700', color: couleurs.texte },
  bouton: {
    minHeight: 52,
    borderRadius: rayons.moyen,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  boutonTexte: { fontSize: 16, fontWeight: '600' },
  carte: { backgroundColor: couleurs.carte, borderRadius: rayons.moyen, borderWidth: 1, borderColor: couleurs.bordure, padding: 16, gap: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99 },
  badgeTexte: { fontSize: 12, fontWeight: '600' },
  aVenir: { alignItems: 'center', gap: 12, paddingVertical: 28 },
  aVenirTexte: { fontSize: 15, color: couleurs.discret, textAlign: 'center', lineHeight: 22 },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: couleurs.fond },
});
