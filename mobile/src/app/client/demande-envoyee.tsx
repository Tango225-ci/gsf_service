import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Bouton, Ecran, Petit } from '@/components/ui';
import { couleurs } from '@/lib/theme';

/** Confirmation après l'envoi d'une demande sans paiement immédiat. */
export default function DemandeEnvoyee() {
  return (
    <Ecran>
      <View style={s.centre}>
        <Ionicons name="checkmark-circle" size={72} color={couleurs.marque} />
        <Text style={s.titre}>Demande envoyée</Text>
        <Petit style={s.texte}>
          Le coordinateur GSF l'affecte à un agent. Vous recevrez une notification dès que votre agent vous enverra ses propositions.
        </Petit>
      </View>
      <Bouton titre="Voir mes demandes" onPress={() => router.replace('/client/demandes')} />
      <Bouton titre="Retour à l'accueil" variante="discret" onPress={() => router.replace('/client')} />
    </Ecran>
  );
}

const s = StyleSheet.create({
  centre: { alignItems: 'center', gap: 12, paddingVertical: 48 },
  titre: { fontSize: 24, fontWeight: '700', color: couleurs.texte },
  texte: { textAlign: 'center', fontSize: 15, lineHeight: 22 },
});
