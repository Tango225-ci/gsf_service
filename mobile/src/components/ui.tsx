import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { initiales } from '@/lib/format';
import { couleurs, rayons } from '@/lib/theme';

export type NomIcone = ComponentProps<typeof Ionicons>['name'];

/**
 * Écran commun : en-tête (avec retour si `retour`), contenu défilant, pied de page fixe facultatif.
 */
export function Ecran({
  titre,
  sousTitre,
  retour = false,
  actionDroite,
  piedDePage,
  defilement = true,
  children,
}: {
  titre?: string;
  sousTitre?: string;
  retour?: boolean;
  actionDroite?: ReactNode;
  piedDePage?: ReactNode;
  defilement?: boolean;
  children: ReactNode;
}) {
  const entete = (titre || retour) && (
    <View style={[styles.entete, retour && styles.enteteRetour]}>
      {retour && (
        <Pressable accessibilityRole="button" accessibilityLabel="Retour" hitSlop={10} onPress={() => router.back()} style={styles.retour}>
          <Ionicons name="chevron-back" size={24} color={couleurs.texte} />
        </Pressable>
      )}
      <View style={{ flex: 1 }}>
        {titre && <Text style={[styles.titre, retour && styles.titreRetour]} numberOfLines={1}>{titre}</Text>}
        {sousTitre && <Text style={styles.sousTitre} numberOfLines={1}>{sousTitre}</Text>}
      </View>
      {actionDroite}
    </View>
  );

  return (
    <SafeAreaView style={styles.ecran} edges={['top']}>
      {entete}
      {defilement ? (
        <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.contenu, { flex: 1 }]}>{children}</View>
      )}
      {piedDePage && <View style={styles.pied}>{piedDePage}</View>}
    </SafeAreaView>
  );
}

export function Bouton({
  titre,
  onPress,
  variante = 'principal',
  petit = false,
  chargement = false,
  desactive = false,
  icone,
  style,
}: {
  titre: string;
  onPress: () => void;
  variante?: 'principal' | 'secondaire' | 'discret';
  petit?: boolean;
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
        petit && styles.boutonPetit,
        { backgroundColor: v.fond, borderColor: v.bord, opacity: inactif ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {chargement ? (
        <ActivityIndicator color={v.texte} />
      ) : (
        <>
          {icone && <Ionicons name={icone} size={petit ? 16 : 20} color={v.texte} />}
          <Text style={[styles.boutonTexte, petit && { fontSize: 14 }, { color: v.texte }]}>{titre}</Text>
        </>
      )}
    </Pressable>
  );
}

const VARIANTES = {
  principal: { fond: couleurs.marque, bord: couleurs.marque, texte: couleurs.surMarque },
  secondaire: { fond: couleurs.carte, bord: couleurs.marque, texte: couleurs.marque },
  discret: { fond: 'transparent', bord: 'transparent', texte: couleurs.marque },
};

export function Carte({
  children,
  style,
  onPress,
  bande,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  /** Bande de couleur à gauche (urgence, statut). */
  bande?: string;
}) {
  const contenu = [styles.carte, bande ? { borderLeftWidth: 4, borderLeftColor: bande } : null, style];
  if (!onPress) return <View style={contenu}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [contenu, pressed && { opacity: 0.85 }]}>
      {children}
    </Pressable>
  );
}

const TONS = {
  marque: { fond: couleurs.marqueClair, texte: couleurs.marque },
  accent: { fond: couleurs.accentClair, texte: couleurs.accent },
  retard: { fond: couleurs.retardClair, texte: couleurs.retard },
  neutre: { fond: couleurs.fond, texte: couleurs.discret },
};
export type Ton = keyof typeof TONS;

export function Badge({ texte, ton = 'marque' }: { texte: string; ton?: Ton }) {
  const t = TONS[ton];
  return (
    <View style={[styles.badge, { backgroundColor: t.fond }, ton === 'neutre' && styles.badgeNeutre]}>
      <Text style={[styles.badgeTexte, { color: t.texte }]} numberOfLines={1}>{texte}</Text>
    </View>
  );
}

/** Pastille sélectionnable (option, filtre, choix). */
export function Puce({ libelle, actif, onPress }: { libelle: string; actif: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: actif }}
      onPress={onPress}
      style={[styles.puce, actif && styles.puceActive]}
    >
      <Text style={[styles.puceTexte, actif && styles.puceTexteActive]}>{libelle}</Text>
    </Pressable>
  );
}

export function Puces({ children }: { children: ReactNode }) {
  return <View style={styles.puces}>{children}</View>;
}

export function Champ({ libelle, aide, ...props }: TextInputProps & { libelle: string; aide?: string }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={styles.groupe}>
      <Text style={styles.libelle}>{libelle}</Text>
      <TextInput
        accessibilityLabel={libelle}
        placeholderTextColor={couleurs.gris}
        {...props}
        onFocus={(e) => {
          setFocus(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          props.onBlur?.(e);
        }}
        style={[styles.champ, focus && styles.champFocus, props.multiline && styles.champMulti, props.style]}
      />
      {aide && <Text style={styles.aide}>{aide}</Text>}
    </View>
  );
}

/** Groupe de formulaire avec un libellé, pour des contenus autres qu'un champ texte. */
export function Groupe({ libelle, children }: { libelle: string; children: ReactNode }) {
  return (
    <View style={styles.groupe}>
      <Text style={styles.libelle}>{libelle}</Text>
      {children}
    </View>
  );
}

/** Choix exclusif présenté en lignes (moyen de paiement, réception…). */
export function ChoixLigne({ libelle, actif, onPress }: { libelle: string; actif: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ checked: actif }} onPress={onPress} style={[styles.choix, actif && styles.choixActif]}>
      <Ionicons name={actif ? 'radio-button-on' : 'radio-button-off'} size={20} color={actif ? couleurs.marque : couleurs.gris} />
      <Text style={styles.choixTexte}>{libelle}</Text>
    </Pressable>
  );
}

export function CaseACocher({ libelle, coche, onPress }: { libelle: string; coche: boolean; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: coche }} onPress={onPress} style={styles.case}>
      <Ionicons name={coche ? 'checkbox' : 'square-outline'} size={22} color={coche ? couleurs.marque : couleurs.gris} />
      <Text style={[styles.caseTexte, !coche && { color: couleurs.discret }]}>{libelle}</Text>
    </Pressable>
  );
}

export function Bascule({ libelle, valeur, onChange }: { libelle: string; valeur: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.bascule}>
      <Text style={styles.caseTexte}>{libelle}</Text>
      <Switch value={valeur} onValueChange={onChange} trackColor={{ true: couleurs.marque, false: couleurs.bordure }} thumbColor="#FFFFFF" />
    </View>
  );
}

/** Ligne libellé / montant d'un récapitulatif. */
export function LigneMontant({ libelle, montant, fort = false, total = false, discret = false }: { libelle: string; montant: string; fort?: boolean; total?: boolean; discret?: boolean }) {
  return (
    <View style={[styles.ligne, total && styles.ligneTotal]}>
      <Text style={[styles.ligneLibelle, fort && styles.fort, discret && styles.ligneDiscrete]}>{libelle}</Text>
      <Text style={[styles.ligneMontant, fort && styles.fort, discret && styles.ligneDiscrete]}>{montant}</Text>
    </View>
  );
}

export function TitreSection({ titre, action }: { titre: string; action?: ReactNode }) {
  return (
    <View style={styles.titreSection}>
      <Text style={styles.titreSectionTexte}>{titre}</Text>
      {action}
    </View>
  );
}

export function Avatar({ nom, taille = 40 }: { nom: string; taille?: number }) {
  return (
    <View style={[styles.avatar, { width: taille, height: taille, borderRadius: taille / 2 }]}>
      <Text style={[styles.avatarTexte, { fontSize: taille * 0.36 }]}>{initiales(nom)}</Text>
    </View>
  );
}

/** Emplacement d'une photo (les vraies photos arrivent avec l'API). */
export function Vignette({ hauteur = 64, largeur, texte }: { hauteur?: number; largeur?: number; texte?: string }) {
  return (
    <View style={[styles.vignette, { height: hauteur }, largeur ? { width: largeur } : { flex: 1 }]}>
      {texte ? <Text style={styles.vignetteTexte}>{texte}</Text> : <Ionicons name="image-outline" size={20} color={couleurs.gris} />}
    </View>
  );
}

export function Vignettes({ nombre, ajout = false, onAjout }: { nombre: number; ajout?: boolean; onAjout?: () => void }) {
  return (
    <View style={styles.vignettes}>
      {Array.from({ length: nombre }).map((_, i) => (
        <Vignette key={i} hauteur={56} largeur={56} />
      ))}
      {ajout && (
        <Pressable accessibilityRole="button" accessibilityLabel="Ajouter une photo" onPress={onAjout} style={styles.ajout}>
          <Ionicons name="add" size={24} color={couleurs.marque} />
        </Pressable>
      )}
    </View>
  );
}

export function Note({ texte, ton = 'accent' }: { texte: string; ton?: Ton }) {
  const t = TONS[ton];
  return (
    <View style={[styles.note, { backgroundColor: t.fond }]}>
      <Ionicons name="information-circle-outline" size={18} color={t.texte} />
      <Text style={[styles.noteTexte, { color: t.texte }]}>{texte}</Text>
    </View>
  );
}

export function Petit({ children, style }: { children: ReactNode; style?: StyleProp<import('react-native').TextStyle> }) {
  return <Text style={[styles.petit, style]}>{children}</Text>;
}

export function Ligne({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.rangee, style]}>{children}</View>;
}

/** Écran prévu mais pas encore dessiné. */
export function EcranAVenir({ titre, icone, description, lot }: { titre: string; icone: NomIcone; description: string; lot: string }) {
  return (
    <Ecran titre={titre}>
      <Carte style={styles.aVenir}>
        <Ionicons name={icone} size={36} color={couleurs.marque} />
        <Text style={styles.aVenirTexte}>{description}</Text>
        <Badge texte={`Prévu au ${lot}`} ton="accent" />
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

export const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: couleurs.ecran },
  entete: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  enteteRetour: { paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: couleurs.bordure, paddingBottom: 8, backgroundColor: couleurs.carte },
  retour: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  titre: { fontSize: 26, fontWeight: '700', color: couleurs.texte },
  titreRetour: { fontSize: 18, fontWeight: '600' },
  sousTitre: { fontSize: 13, color: couleurs.discret },
  contenu: { padding: 16, gap: 12, paddingBottom: 32 },
  pied: { padding: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: couleurs.bordure, backgroundColor: couleurs.carte, gap: 8 },
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
  boutonPetit: { minHeight: 40, paddingHorizontal: 12 },
  boutonTexte: { fontSize: 16, fontWeight: '600' },
  carte: { backgroundColor: couleurs.carte, borderRadius: rayons.moyen, borderWidth: 1, borderColor: couleurs.bordure, padding: 14, gap: 6 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99, maxWidth: 180 },
  badgeNeutre: { borderWidth: 1, borderColor: couleurs.bordure, backgroundColor: 'transparent' },
  badgeTexte: { fontSize: 12, fontWeight: '600' },
  puces: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  puce: { minHeight: 36, paddingHorizontal: 14, borderRadius: 99, borderWidth: 1, borderColor: couleurs.bordure, backgroundColor: couleurs.carte, justifyContent: 'center' },
  puceActive: { backgroundColor: couleurs.marqueClair, borderColor: couleurs.marque },
  puceTexte: { fontSize: 14, color: couleurs.texte },
  puceTexteActive: { color: couleurs.marque, fontWeight: '600' },
  groupe: { gap: 6 },
  libelle: { fontSize: 12, fontWeight: '600', color: couleurs.discret, textTransform: 'uppercase', letterSpacing: 0.5 },
  champ: { minHeight: 48, borderRadius: rayons.moyen, borderWidth: 1, borderColor: couleurs.bordure, backgroundColor: couleurs.carte, paddingHorizontal: 14, fontSize: 16, color: couleurs.texte },
  champFocus: { borderColor: couleurs.marque, borderWidth: 2 },
  champMulti: { minHeight: 84, paddingTop: 12, textAlignVertical: 'top' },
  aide: { fontSize: 13, color: couleurs.discret },
  choix: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, paddingHorizontal: 12, borderRadius: rayons.moyen, borderWidth: 1, borderColor: couleurs.bordure, backgroundColor: couleurs.carte },
  choixActif: { borderColor: couleurs.marque, backgroundColor: couleurs.marqueClair },
  choixTexte: { fontSize: 15, color: couleurs.texte, flex: 1 },
  case: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 36 },
  caseTexte: { fontSize: 15, color: couleurs.texte, flex: 1 },
  bascule: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 },
  ligne: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 3 },
  ligneTotal: { borderTopWidth: 1, borderTopColor: couleurs.bordure, marginTop: 4, paddingTop: 8 },
  ligneLibelle: { fontSize: 14, color: couleurs.texte, flex: 1 },
  ligneMontant: { fontSize: 14, color: couleurs.texte, fontVariant: ['tabular-nums'] },
  ligneDiscrete: { color: couleurs.discret, fontSize: 13 },
  fort: { fontWeight: '700', fontSize: 15 },
  titreSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  titreSectionTexte: { fontSize: 16, fontWeight: '700', color: couleurs.texte },
  avatar: { backgroundColor: couleurs.accentClair, alignItems: 'center', justifyContent: 'center' },
  avatarTexte: { color: couleurs.accent, fontWeight: '700' },
  vignette: { backgroundColor: couleurs.fond, borderRadius: rayons.petit, borderWidth: 1, borderColor: couleurs.bordure, alignItems: 'center', justifyContent: 'center' },
  vignetteTexte: { color: couleurs.discret, fontWeight: '600' },
  vignettes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ajout: { width: 56, height: 56, borderRadius: rayons.petit, borderWidth: 1, borderStyle: 'dashed', borderColor: couleurs.marque, alignItems: 'center', justifyContent: 'center' },
  note: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', borderRadius: rayons.moyen, padding: 10 },
  noteTexte: { flex: 1, fontSize: 13, lineHeight: 18 },
  petit: { fontSize: 13, color: couleurs.discret, lineHeight: 18 },
  rangee: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  aVenir: { alignItems: 'center', gap: 12, paddingVertical: 28 },
  aVenirTexte: { fontSize: 15, color: couleurs.discret, textAlign: 'center', lineHeight: 22 },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: couleurs.fond },
});
