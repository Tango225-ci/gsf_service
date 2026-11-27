import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Bouton, Carte, Ecran, Petit, TitreSection } from '@/components/ui';
import { CATEGORIES, DEMANDES, prixAffiche, SERVICES, type Categorie } from '@/lib/demo';
import { useSession } from '@/lib/session';
import { couleurs, rayons } from '@/lib/theme';

/** Maquette client 1 : demandes en cours en haut, puis le catalogue avec un prix indicatif. */
export default function AccueilClient() {
  const { utilisateur } = useSession();
  const enCours = DEMANDES.filter((d) => d.couleur !== 'discret');
  const aTraiter = enCours.find((d) => d.propositions);

  return (
    <Ecran titre={`Bonjour ${utilisateur?.prenom ?? ''}`}>
      {aTraiter && (
        <Carte bande={couleurs.accent}>
          <View style={s.rangee}>
            <Text style={s.titreCarte}>{aTraiter.titre}</Text>
            <Badge texte={aTraiter.statut} ton="accent" />
          </View>
          <Petit>{aTraiter.resume}</Petit>
          <Bouton titre="Voir les propositions" petit onPress={() => router.push(`/client/propositions/${aTraiter.id}`)} />
        </Carte>
      )}

      <TitreSection titre="Nos services" />
      <View style={s.grille}>
        <Tuile titre="Résidence meublée" prix={prixAffiche(SERVICES[0])} icone="bed-outline" onPress={() => router.push('/client/service/residence-meublee')} />
        <Tuile titre="Location de véhicule" prix={prixAffiche(SERVICES[1])} icone="car-outline" onPress={() => router.push('/client/service/location-vehicule')} />
        <Tuile titre="Accueil à l'aéroport" prix={prixAffiche(SERVICES[2])} icone="airplane-outline" alt onPress={() => router.push('/client/service/accueil-aeroport')} />
        {(['demarches', 'foncier', 'autre'] as Categorie[]).map((c) => (
          <Tuile
            key={c}
            titre={CATEGORIES[c].nom}
            prix={CATEGORIES[c].prixIndicatif}
            icone={CATEGORIES[c].icone as never}
            alt={c === 'demarches'}
            onPress={() => router.push(c === 'autre' ? '/client/nouvelle-demande?service=autre-demande' : `/client/categorie/${c}`)}
          />
        ))}
      </View>

      <TitreSection titre="Mes demandes" action={<Bouton titre="Tout voir" variante="discret" petit onPress={() => router.push('/client/demandes')} />} />
      {enCours.map((d) => (
        <Carte key={d.id} onPress={() => router.push(`/client/demande/${d.id}`)}>
          <View style={s.rangee}>
            <Text style={s.titreCarte}>{d.titre}</Text>
            <Badge texte={d.statut} ton={d.couleur === 'accent' ? 'accent' : 'marque'} />
          </View>
          <Petit>{d.resume}</Petit>
        </Carte>
      ))}
    </Ecran>
  );
}

function Tuile({ titre, prix, icone, alt = false, onPress }: { titre: string; prix: string; icone: React.ComponentProps<typeof Ionicons>['name']; alt?: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s.tuile, alt && s.tuileAlt, pressed && { opacity: 0.85 }]}>
      <Ionicons name={icone} size={22} color={alt ? couleurs.accent : couleurs.marque} />
      <Text style={s.tuileTitre}>{titre}</Text>
      <Text style={s.tuilePrix}>{prix}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  rangee: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  titreCarte: { fontSize: 16, fontWeight: '600', color: couleurs.texte, flex: 1 },
  grille: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tuile: { width: '48%', flexGrow: 1, minHeight: 96, borderRadius: rayons.moyen, backgroundColor: couleurs.marqueClair, padding: 12, gap: 4, justifyContent: 'flex-end' },
  tuileAlt: { backgroundColor: couleurs.accentClair },
  tuileTitre: { fontSize: 14, fontWeight: '600', color: couleurs.texte },
  tuilePrix: { fontSize: 12, color: couleurs.discret },
});
