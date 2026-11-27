import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSession } from '@/lib/session';
import { couleurs } from '@/lib/theme';
import type { RoleApp } from '@/lib/types';
import { Avatar, Badge, Bouton, Carte, Ecran, type NomIcone } from './ui';

const LIBELLES_ROLE: Record<RoleApp, string> = { client: 'Client', agent: 'Agent GSF', coordinateur: 'Coordinateur' };

/** Profil, commun aux trois rôles, avec des lignes propres à chacun. */
export function EcranProfil() {
  const { utilisateur, deconnecter } = useSession();
  if (!utilisateur) return null;
  const nom = `${utilisateur.prenom} ${utilisateur.nom}`;

  return (
    <Ecran titre="Profil">
      <Carte>
        <View style={s.identite}>
          <Avatar nom={nom} taille={56} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={s.nom}>{nom}</Text>
            <Badge texte={LIBELLES_ROLE[utilisateur.role]} />
          </View>
        </View>
      </Carte>

      <Carte style={{ padding: 0, gap: 0 }}>
        {utilisateur.role === 'client' ? (
          <>
            <LigneProfil icone="map-outline" libelle="Mes biens" valeur="2 terrains" onPress={() => router.push('/client/biens')} />
            <LigneProfil icone="people-outline" libelle="Mes proches sur place" valeur="1 proche" />
            <LigneProfil icone="cash-outline" libelle="Devise affichée" valeur="Euro (€)" />
          </>
        ) : (
          <>
            <LigneProfil icone="briefcase-outline" libelle="Compétences" valeur={utilisateur.role === 'agent' ? 'Séjour, démarches' : 'Toutes'} />
            <LigneProfil icone="location-outline" libelle="Zones" valeur="Cocody, Plateau" />
          </>
        )}
        <LigneProfil icone="language-outline" libelle="Langue" valeur="Français" />
        <LigneProfil icone="notifications-outline" libelle="Notifications" valeur="Activées" />
        <LigneProfil icone="shield-checkmark-outline" libelle="Confidentialité" dernier />
      </Carte>

      <Bouton titre="Se déconnecter" variante="secondaire" icone="log-out-outline" onPress={() => void deconnecter()} />
      {utilisateur.role === 'client' && <Bouton titre="Supprimer mon compte" variante="discret" petit onPress={() => {}} />}
    </Ecran>
  );
}

function LigneProfil({ icone, libelle, valeur, onPress, dernier = false }: { icone: NomIcone; libelle: string; valeur?: string; onPress?: () => void; dernier?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s.ligne, !dernier && s.separateur, pressed && { opacity: 0.7 }]}>
      <Ionicons name={icone} size={20} color={couleurs.marque} />
      <Text style={s.libelle}>{libelle}</Text>
      {valeur && <Text style={s.valeur}>{valeur}</Text>}
      <Ionicons name="chevron-forward" size={18} color={couleurs.gris} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  identite: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  nom: { fontSize: 18, fontWeight: '600', color: couleurs.texte },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingHorizontal: 14 },
  separateur: { borderBottomWidth: 1, borderBottomColor: couleurs.bordure },
  libelle: { flex: 1, fontSize: 15, color: couleurs.texte },
  valeur: { fontSize: 14, color: couleurs.discret },
});
