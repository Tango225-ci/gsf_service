import { StyleSheet, Text, View } from 'react-native';
import { Bouton, Carte, Ecran } from '@/components/ui';
import { useSession } from '@/lib/session';
import { couleurs } from '@/lib/theme';

/** Connexion. La vraie connexion par code SMS ou email arrive au lot 1. */
export default function Connexion() {
  const { entrerEnDemo } = useSession();

  return (
    <Ecran>
      <View style={styles.entete}>
        <Text style={styles.marque}>GSF Service</Text>
        <Text style={styles.slogan}>Votre conciergerie en Côte d'Ivoire</Text>
      </View>

      <Carte>
        <Text style={styles.info}>La connexion par code SMS ou email arrive au lot 1.</Text>
      </Carte>

      {__DEV__ && (
        <Carte>
          <Text style={styles.titreDemo}>Mode démonstration (développement)</Text>
          <Text style={styles.info}>Entrer dans l'app avec un rôle, sans compte ni serveur :</Text>
          <Bouton titre="Client" icone="person-outline" onPress={() => entrerEnDemo('client')} />
          <Bouton titre="Agent" icone="briefcase-outline" variante="secondaire" onPress={() => entrerEnDemo('agent')} />
          <Bouton titre="Coordinateur" icone="git-branch-outline" variante="secondaire" onPress={() => entrerEnDemo('coordinateur')} />
        </Carte>
      )}
    </Ecran>
  );
}

const styles = StyleSheet.create({
  entete: { paddingVertical: 32, gap: 6 },
  marque: { fontSize: 34, fontWeight: '700', color: couleurs.marque },
  slogan: { fontSize: 16, color: couleurs.discret },
  titreDemo: { fontSize: 16, fontWeight: '600', color: couleurs.texte },
  info: { fontSize: 14, color: couleurs.discret, lineHeight: 20 },
});
