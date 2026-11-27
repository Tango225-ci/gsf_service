import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { couleurs } from '@/lib/theme';
import { Logo } from './Logo';
import { Ecran } from './ui';

/**
 * Mise en page commune au parcours de connexion (connexion, création de compte, code) :
 * bandeau blanc avec le logo, puis carte au liseré rouge qui chevauche le bas du bandeau.
 */
export function EcranConnexion({
  titre,
  sousTitre,
  retour = false,
  slogan = false,
  children,
  apresCarte,
}: {
  titre: string;
  sousTitre?: string;
  retour?: boolean;
  /** Affiche le slogan sous le logo (écran de connexion). */
  slogan?: boolean;
  children: ReactNode;
  /** Contenu sous la carte (lien, comptes de démonstration…). */
  apresCarte?: ReactNode;
}) {
  return (
    <Ecran>
      <View style={[s.bandeau, !slogan && s.bandeauCompact]}>
        {retour && (
          <Pressable accessibilityRole="button" accessibilityLabel="Retour" hitSlop={10} onPress={() => router.back()} style={s.retour}>
            <Ionicons name="chevron-back" size={24} color={couleurs.texte} />
          </Pressable>
        )}
        <Logo largeur={slogan ? 210 : 160} />
        {slogan && <Text style={s.slogan}>Votre conciergerie en Côte d'Ivoire, même à distance.</Text>}
      </View>

      <View style={s.carte}>
        <View style={{ gap: 4 }}>
          <Text style={s.titre}>{titre}</Text>
          {sousTitre && <Text style={s.sousTitre}>{sousTitre}</Text>}
        </View>
        {children}
      </View>

      {apresCarte}
    </Ecran>
  );
}

/** Interrupteur à deux choix (Téléphone / Email), dans le style de la carte de connexion. */
export function Segments<T extends string>({
  valeur,
  options,
  onChange,
}: {
  valeur: T;
  options: { valeur: T; libelle: string; icone: React.ComponentProps<typeof Ionicons>['name'] }[];
  onChange: (v: T) => void;
}) {
  return (
    <View style={s.segments} accessibilityRole="tablist">
      {options.map((o) => {
        const actif = o.valeur === valeur;
        return (
          <Pressable key={o.valeur} accessibilityRole="tab" accessibilityState={{ selected: actif }} onPress={() => onChange(o.valeur)} style={[s.segment, actif && s.segmentActif]}>
            <Ionicons name={o.icone} size={17} color={actif ? couleurs.marque : couleurs.discret} />
            <Text style={[s.segmentTexte, actif && s.segmentTexteActif]}>{o.libelle}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Lien centré sous la carte : « Pas encore inscrit ? Créer un compte ». */
export function LienSousCarte({ texte, lien, onPress }: { texte: string; lien: string; onPress: () => void }) {
  return (
    <View style={s.sousCarte}>
      <Text style={s.sousCarteTexte}>{texte}</Text>
      <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8}>
        <Text style={s.lien}>{lien}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  bandeau: {
    alignItems: 'center',
    gap: 10,
    marginHorizontal: -16,
    marginTop: -16,
    paddingTop: 36,
    paddingBottom: 56,
    paddingHorizontal: 24,
    backgroundColor: couleurs.carte,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    boxShadow: '0px 2px 10px rgba(17, 17, 17, 0.05)',
  },
  bandeauCompact: { paddingTop: 20, paddingBottom: 52 },
  retour: { position: 'absolute', left: 12, top: 12, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  slogan: { fontSize: 15, color: couleurs.discret, textAlign: 'center' },
  carte: {
    marginTop: -36,
    backgroundColor: couleurs.carte,
    borderRadius: 22,
    padding: 20,
    gap: 16,
    borderTopWidth: 4,
    borderTopColor: couleurs.marque,
    boxShadow: '0px 10px 30px rgba(17, 17, 17, 0.12)',
  },
  titre: { fontSize: 24, fontWeight: '800', color: couleurs.texte },
  sousTitre: { fontSize: 14, color: couleurs.discret, lineHeight: 20 },
  segments: { flexDirection: 'row', backgroundColor: couleurs.fond, borderRadius: 14, padding: 4, gap: 4 },
  segment: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 42, borderRadius: 10 },
  segmentActif: { backgroundColor: couleurs.carte, boxShadow: '0px 2px 6px rgba(17, 17, 17, 0.10)' },
  segmentTexte: { fontSize: 15, fontWeight: '500', color: couleurs.discret },
  segmentTexteActif: { color: couleurs.marque, fontWeight: '700' },
  sousCarte: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 8 },
  sousCarteTexte: { fontSize: 15, color: couleurs.discret },
  lien: { fontSize: 15, fontWeight: '700', color: couleurs.marque },
});
