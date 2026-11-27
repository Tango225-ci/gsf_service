import { StyleSheet, Text } from 'react-native';
import { useSession } from '@/lib/session';
import { couleurs } from '@/lib/theme';
import type { RoleApp } from '@/lib/types';
import { Badge, Bouton, Carte, Ecran } from './ui';

const LIBELLES_ROLE: Record<RoleApp, string> = { client: 'Client', agent: 'Agent GSF', coordinateur: 'Coordinateur' };

/** Profil, commun aux trois rôles. Le contenu complet arrive au lot 1. */
export function EcranProfil() {
  const { utilisateur, deconnecter } = useSession();
  if (!utilisateur) return null;
  return (
    <Ecran titre="Profil">
      <Carte>
        <Text style={styles.nom}>
          {utilisateur.prenom} {utilisateur.nom}
        </Text>
        <Badge texte={LIBELLES_ROLE[utilisateur.role]} />
      </Carte>
      <Bouton titre="Se déconnecter" variante="secondaire" icone="log-out-outline" onPress={() => void deconnecter()} />
    </Ecran>
  );
}

const styles = StyleSheet.create({
  nom: { fontSize: 18, fontWeight: '600', color: couleurs.texte },
});
