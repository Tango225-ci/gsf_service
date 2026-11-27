import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { FilSuivi } from '@/components/FilSuivi';
import { Avatar, Badge, Bouton, Carte, Ecran, Petit } from '@/components/ui';
import { CONVERSATIONS, demande as trouverDemande } from '@/lib/demo';
import { couleurs } from '@/lib/theme';

/** Maquette client 6 : suivi d'une demande, avec son agent et chaque étape datée. */
export default function SuiviDemande() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const d = trouverDemande(id);
  if (!d) return <Ecran titre="Demande introuvable" retour><Petit>Cette demande n'existe pas.</Petit></Ecran>;
  const conversation = CONVERSATIONS.find((c) => c.demandeId === d.id);

  return (
    <Ecran titre={d.titre} sousTitre={d.numero} retour>
      {d.agent && (
        <Carte>
          <View style={s.agent}>
            <Avatar nom={d.agent.nom} />
            <View style={{ flex: 1 }}>
              <Text style={s.nom}>{d.agent.nom}</Text>
              <Petit>Votre agent GSF</Petit>
            </View>
            <Bouton titre="Message" petit variante="secondaire" icone="chatbubble-outline" onPress={() => router.push(conversation ? `/client/conversation/${conversation.id}` : '/client/messages')} />
          </View>
        </Carte>
      )}

      <View style={s.statut}>
        <Badge texte={d.statut} ton={d.couleur === 'accent' ? 'accent' : d.couleur === 'discret' ? 'neutre' : 'marque'} />
        <Petit>{d.resume}</Petit>
      </View>

      {d.propositions && <Bouton titre="Voir les propositions" onPress={() => router.push(`/client/propositions/${d.id}`)} />}
      {d.id === '0161' && <Bouton titre="Voir le rapport de visite" icone="document-text-outline" onPress={() => router.push(`/client/rapport/${d.id}`)} />}

      <Carte>
        <FilSuivi etapes={d.etapes} />
      </Carte>
    </Ecran>
  );
}

const s = StyleSheet.create({
  agent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nom: { fontSize: 16, fontWeight: '600', color: couleurs.texte },
  statut: { gap: 6 },
});
