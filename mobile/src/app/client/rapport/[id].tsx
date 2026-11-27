import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Bouton, Carte, Ecran, LigneMontant, Ligne, Petit, Vignette, Vignettes } from '@/components/ui';
import { RAPPORT_VISITE } from '@/lib/demo';
import { couleurs } from '@/lib/theme';

/** Maquette client 9 : rapport de visite de terrain, rattaché au terrain du client. */
export default function RapportVisite() {
  const r = RAPPORT_VISITE;
  return (
    <Ecran
      titre="Rapport de visite"
      sousTitre={r.numero}
      retour
      piedDePage={
        <View style={s.boutons}>
          <Bouton titre="Rapport PDF" variante="secondaire" icone="download-outline" style={{ flex: 1 }} onPress={() => {}} />
          <Bouton titre="Demander un bornage" style={{ flex: 1 }} onPress={() => router.push('/client/nouvelle-demande?service=bornage-plan-topo')} />
        </View>
      }
    >
      <Ligne>
        <Petit>
          Rattaché à : <Text style={{ color: couleurs.texte, fontWeight: '600' }}>{r.terrain}</Text>
        </Petit>
        <Badge texte="Terminée" ton="neutre" />
      </Ligne>
      <Vignette hauteur={150} texte="▶ Vidéo · 2 min" />
      <Vignettes nombre={4} />
      <Carte>
        {r.constats.map(([libelle, valeur]) => (
          <LigneMontant key={libelle} libelle={libelle} montant={valeur} fort />
        ))}
      </Carte>
      <Carte>
        <Text style={s.titre}>Observations de l'agent</Text>
        <Petit>{r.observations}</Petit>
        <Petit style={{ fontStyle: 'italic' }}>{r.agent}</Petit>
      </Carte>
      <Petit>Le rapport peut déboucher sur un autre service : bornage, dossier ACD, entretien du terrain…</Petit>
    </Ecran>
  );
}

const s = StyleSheet.create({
  boutons: { flexDirection: 'row', gap: 8 },
  titre: { fontSize: 15, fontWeight: '600', color: couleurs.texte },
});
