import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { chercherPays, drapeau, PAYS_FREQUENTS, paysParCode, type Pays } from '@/lib/pays';
import { couleurs, rayons } from '@/lib/theme';
import { styles as ui } from './ui';

/**
 * Liste déroulante des pays : un champ qui ouvre une fenêtre avec recherche.
 * Les pays fréquents pour GSF (Côte d'Ivoire, France, Canada…) sont en tête.
 */
export function SelecteurPays({ libelle, valeur, onChange }: { libelle: string; valeur: string | null; onChange: (pays: Pays) => void }) {
  const [ouvert, setOuvert] = useState(false);
  const [recherche, setRecherche] = useState('');
  const pays = valeur ? paysParCode(valeur) : undefined;

  const liste = useMemo(() => {
    if (recherche.trim()) return chercherPays(recherche);
    const frequents = PAYS_FREQUENTS.map(paysParCode).filter((p): p is Pays => !!p);
    return [...frequents, ...chercherPays('').filter((p) => !PAYS_FREQUENTS.includes(p.code))];
  }, [recherche]);

  const choisir = (p: Pays) => {
    onChange(p);
    setOuvert(false);
    setRecherche('');
  };

  return (
    <View style={ui.groupe}>
      <Text style={ui.libelle}>{libelle}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`${libelle} : ${pays?.nom ?? 'à choisir'}`} onPress={() => setOuvert(true)} style={[ui.champ, s.declencheur]}>
        {pays ? (
          <Text style={s.valeur}>
            {drapeau(pays.code)}  {pays.nom}
          </Text>
        ) : (
          <Text style={[s.valeur, { color: couleurs.gris }]}>Choisir un pays</Text>
        )}
        <Ionicons name="chevron-down" size={20} color={couleurs.discret} />
      </Pressable>

      <Modal visible={ouvert} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setOuvert(false)}>
        <SafeAreaView style={s.fenetre} edges={['top', 'bottom']}>
          <View style={s.entete}>
            <Text style={s.titre}>{libelle}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Fermer" hitSlop={10} onPress={() => setOuvert(false)}>
              <Ionicons name="close" size={26} color={couleurs.texte} />
            </Pressable>
          </View>
          <View style={s.recherche}>
            <Ionicons name="search" size={18} color={couleurs.discret} />
            <TextInput value={recherche} onChangeText={setRecherche} placeholder="Rechercher un pays ou un indicatif" placeholderTextColor={couleurs.gris} style={s.champRecherche} autoCorrect={false} />
          </View>
          <FlatList
            data={liste}
            keyExtractor={(p, i) => `${p.code}-${i}`}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <>
                {!recherche.trim() && index === PAYS_FREQUENTS.length && <Text style={s.section}>Tous les pays</Text>}
                {!recherche.trim() && index === 0 && <Text style={s.section}>Pays fréquents</Text>}
                <Pressable accessibilityRole="button" onPress={() => choisir(item)} style={({ pressed }) => [s.ligne, item.code === valeur && s.ligneChoisie, pressed && { opacity: 0.7 }]}>
                  <Text style={s.drapeau}>{drapeau(item.code)}</Text>
                  <Text style={s.nom}>{item.nom}</Text>
                  <Text style={s.indicatif}>{item.indicatif}</Text>
                  {item.code === valeur && <Ionicons name="checkmark" size={20} color={couleurs.marque} />}
                </Pressable>
              </>
            )}
            ListEmptyComponent={<Text style={s.vide}>Aucun pays trouvé.</Text>}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

/** Numéro de téléphone, avec le drapeau et l'indicatif du pays affichés dans le champ. */
export function ChampTelephone({
  libelle,
  pays,
  valeur,
  onChange,
  aide,
}: {
  libelle: string;
  pays: Pays | undefined;
  valeur: string;
  onChange: (numero: string) => void;
  aide?: string;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={ui.groupe}>
      <Text style={ui.libelle}>{libelle}</Text>
      <View style={[ui.champ, s.telephone, focus && ui.champFocus]}>
        <View style={s.prefixe}>
          <Text style={s.prefixeTexte}>{pays ? `${drapeau(pays.code)} ${pays.indicatif}` : '+…'}</Text>
        </View>
        <TextInput
          accessibilityLabel={libelle}
          value={valeur}
          onChangeText={(t) => onChange(t.replace(/[^\d\s]/g, ''))}
          placeholder={pays ? 'Numéro sans l’indicatif' : 'Choisissez d’abord le pays'}
          placeholderTextColor={couleurs.gris}
          keyboardType="phone-pad"
          editable={!!pays}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={s.numero}
          autoComplete="tel-national"
        />
      </View>
      {aide && <Text style={ui.aide}>{aide}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  declencheur: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  valeur: { fontSize: 16, color: couleurs.texte },
  fenetre: { flex: 1, backgroundColor: couleurs.ecran },
  entete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  titre: { fontSize: 20, fontWeight: '700', color: couleurs.texte },
  recherche: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginBottom: 8, paddingHorizontal: 12, borderRadius: rayons.moyen, borderWidth: 1, borderColor: couleurs.bordure, backgroundColor: couleurs.carte },
  champRecherche: { flex: 1, minHeight: 46, fontSize: 16, color: couleurs.texte },
  section: { fontSize: 12, fontWeight: '600', color: couleurs.discret, textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 50, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: couleurs.bordure, backgroundColor: couleurs.carte },
  ligneChoisie: { backgroundColor: couleurs.marqueClair },
  drapeau: { fontSize: 22 },
  nom: { flex: 1, fontSize: 16, color: couleurs.texte },
  indicatif: { fontSize: 15, color: couleurs.discret, fontVariant: ['tabular-nums'] },
  vide: { padding: 24, textAlign: 'center', color: couleurs.discret },
  telephone: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 0, overflow: 'hidden' },
  prefixe: { alignSelf: 'stretch', justifyContent: 'center', paddingHorizontal: 12, backgroundColor: couleurs.fond, borderRightWidth: 1, borderRightColor: couleurs.bordure },
  prefixeTexte: { fontSize: 16, fontWeight: '600', color: couleurs.texte },
  numero: { flex: 1, minHeight: 46, paddingHorizontal: 12, fontSize: 16, color: couleurs.texte },
});
