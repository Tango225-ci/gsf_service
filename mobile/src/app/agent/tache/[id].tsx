import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { FilSuivi } from '@/components/FilSuivi';
import { Avatar, Badge, Bouton, Carte, Ecran, Note, Petit, TitreSection } from '@/components/ui';
import { CONVERSATIONS, DEMANDES, TACHES, type Etape } from '@/lib/demo';
import { couleurs } from '@/lib/theme';

const ETAPES_PAR_DEFAUT: Etape[] = [
  { titre: 'Demande envoyée', date: '26 nov.', etat: 'fait' },
  { titre: 'Affectée par le coordinateur', date: '27 nov.', etat: 'fait' },
  { titre: 'Préparation', etat: 'encours' },
  { titre: 'Terminée', etat: 'avenir' },
];

/** Fiche d'une tâche de l'agent : client, note du coordinateur, actions selon le type, suivi. */
export default function FicheTache() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = TACHES.find((x) => x.id === id) ?? TACHES[0];
  const demande = DEMANDES.find((d) => d.id === t.id);
  const conversation = CONVERSATIONS.find((c) => c.demandeId === t.id);

  return (
    <Ecran titre={t.titre} sousTitre={t.numero} retour>
      <Carte>
        <View style={s.client}>
          <Avatar nom={t.detail.split('·')[0]?.trim() || 'Client'} />
          <View style={{ flex: 1 }}>
            <Text style={s.nom}>{t.detail}</Text>
            {t.sousDetail && <Petit>{t.sousDetail}</Petit>}
          </View>
          <Badge texte={t.badge} ton={t.urgence === 'retard' ? 'retard' : t.urgence === 'aujourdhui' ? 'accent' : 'marque'} />
        </View>
      </Carte>
      <Note ton="marque" texte="Note du coordinateur : client joignable sur WhatsApp, préfère les échanges le soir." />

      <TitreSection titre="Actions" />
      {t.type === 'sejour' && <Bouton titre="Créer une proposition" icone="add-circle-outline" onPress={() => router.push(`/agent/proposition/${t.id}`)} />}
      {t.type === 'vehicule' && <Bouton titre="Remise du véhicule" icone="car-outline" onPress={() => router.push(`/agent/remise/${t.id}`)} />}
      {t.type === 'visite' && <Bouton titre="Faire la visite de terrain" icone="map-outline" onPress={() => router.push(`/agent/visite/${t.id}`)} />}
      <Bouton titre="Mettre à jour l'étape" icone="camera-outline" variante={t.type === 'demarche' || t.type === 'aeroport' ? 'principal' : 'secondaire'} onPress={() => router.push(`/agent/etape/${t.id}`)} />
      <Bouton titre="Message au client" icone="chatbubble-outline" variante="secondaire" onPress={() => router.push(`/agent/conversation/${conversation?.id ?? 'c1'}`)} />

      <TitreSection titre="Suivi" />
      <Carte>
        <FilSuivi etapes={demande?.etapes ?? ETAPES_PAR_DEFAUT} />
      </Carte>
    </Ecran>
  );
}

const s = StyleSheet.create({
  client: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nom: { fontSize: 15, fontWeight: '600', color: couleurs.texte },
});
