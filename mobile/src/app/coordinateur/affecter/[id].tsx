import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Badge, Bouton, Carte, Champ, Ecran, Ligne, Petit, TitreSection } from '@/components/ui';
import { A_AFFECTER, CATEGORIES, EQUIPE, type MembreEquipe } from '@/lib/demo';
import { couleurs } from '@/lib/theme';

/**
 * Maquette coordinateur 2 : choisir l'agent. Suggestions selon le type de service, puis la charge.
 * Un seul agent par demande ; il est notifié.
 */
export default function AffecterDemande() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const d = A_AFFECTER.find((x) => x.id === id) ?? A_AFFECTER[0];
  const disponibles = EQUIPE.filter((e) => e.disponible);
  const suggeres = disponibles.filter((e) => e.competences.includes(d.categorie)).sort((a, b) => a.dossiers - b.dossiers);
  const autres = disponibles.filter((e) => !suggeres.includes(e));
  const [choisi, setChoisi] = useState(suggeres[0]?.id);
  const [voirTout, setVoirTout] = useState(false);
  const agent = EQUIPE.find((e) => e.id === choisi);

  return (
    <Ecran
      titre="Affecter la demande"
      retour
      piedDePage={<Bouton titre={agent ? `Affecter à ${agent.nom}` : 'Choisissez un agent'} desactive={!agent} onPress={() => router.back()} />}
    >
      <Carte>
        <Ligne>
          <Text style={s.titre}>{d.titre}</Text>
          <Badge texte={CATEGORIES[d.categorie].nom.split(' ')[0]} />
        </Ligne>
        <Petit>
          {d.numero} · {d.client}
        </Petit>
        <Petit>{d.detail}</Petit>
      </Carte>

      <TitreSection titre={`Agents suggérés · ${CATEGORIES[d.categorie].nom.toLowerCase()}`} />
      {suggeres.map((e) => (
        <CarteAgent key={e.id} membre={e} choisi={choisi === e.id} onPress={() => setChoisi(e.id)} />
      ))}

      {voirTout ? (
        <>
          <TitreSection titre="Autres agents" />
          {autres.map((e) => (
            <CarteAgent key={e.id} membre={e} choisi={choisi === e.id} onPress={() => setChoisi(e.id)} />
          ))}
        </>
      ) : (
        <Bouton titre="Voir toute l'équipe" variante="discret" petit onPress={() => setVoirTout(true)} />
      )}

      <Champ libelle="Note pour l'agent (facultatif)" multiline defaultValue="Client joignable sur WhatsApp, préfère les échanges le soir." />
    </Ecran>
  );
}

function CarteAgent({ membre: e, choisi, onPress }: { membre: MembreEquipe; choisi: boolean; onPress: () => void }) {
  return (
    <Carte onPress={onPress} style={choisi && { borderColor: couleurs.marque, borderWidth: 2 }}>
      <View style={s.agent}>
        <Avatar nom={e.nom} />
        <View style={{ flex: 1 }}>
          <Text style={s.nom}>{e.nom}</Text>
          <Petit>{e.poste}</Petit>
        </View>
        {choisi && <Badge texte="Choisi" />}
      </View>
      <Petit>
        {e.dossiers} dossiers en cours · zone {e.zone}
      </Petit>
    </Carte>
  );
}

const s = StyleSheet.create({
  titre: { fontSize: 16, fontWeight: '600', color: couleurs.texte, flex: 1 },
  agent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nom: { fontSize: 15, fontWeight: '600', color: couleurs.texte },
});
