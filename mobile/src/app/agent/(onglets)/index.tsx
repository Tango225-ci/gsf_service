import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Badge, Carte, Ecran, Ligne, Petit, Puce, Puces, type Ton } from '@/components/ui';
import { TACHES, type Tache } from '@/lib/demo';
import { useSession } from '@/lib/session';
import { couleurs } from '@/lib/theme';

const URGENCES: Record<Tache['urgence'], { ton: Ton; couleur: string }> = {
  retard: { ton: 'retard', couleur: couleurs.retard },
  aujourdhui: { ton: 'accent', couleur: couleurs.accent },
  normal: { ton: 'marque', couleur: couleurs.marque },
  nouvelle: { ton: 'neutre', couleur: couleurs.bordure },
};

/** Maquette agent 1 : mes tâches, triées par urgence (retards, rendez-vous du jour, nouvelles demandes). */
export default function TachesAgent() {
  const { utilisateur } = useSession();
  const [filtre, setFiltre] = useState<'tout' | 'retard' | 'nouvelle'>('tout');
  const liste = TACHES.filter((t) => filtre === 'tout' || t.urgence === filtre);
  const nb = (u: Tache['urgence']) => TACHES.filter((t) => t.urgence === u).length;

  return (
    <Ecran titre="Mes tâches" sousTitre={`Bonjour ${utilisateur?.prenom ?? ''} · ${TACHES.length} demandes affectées`}>
      <Puces>
        <Puce libelle={`Tout · ${TACHES.length}`} actif={filtre === 'tout'} onPress={() => setFiltre('tout')} />
        <Puce libelle={`En retard · ${nb('retard')}`} actif={filtre === 'retard'} onPress={() => setFiltre('retard')} />
        <Puce libelle={`Nouvelles · ${nb('nouvelle')}`} actif={filtre === 'nouvelle'} onPress={() => setFiltre('nouvelle')} />
      </Puces>
      {liste.map((t) => (
        <Carte key={t.id} bande={URGENCES[t.urgence].couleur} onPress={() => router.push(`/agent/tache/${t.id}`)}>
          <Ligne>
            <Text style={s.titre}>{t.titre}</Text>
            <Badge texte={t.badge} ton={URGENCES[t.urgence].ton} />
          </Ligne>
          <Petit>
            {t.numero} · {t.detail}
          </Petit>
          {t.sousDetail && <Petit style={t.urgence === 'retard' ? { color: couleurs.retard } : undefined}>{t.sousDetail}</Petit>}
        </Carte>
      ))}
    </Ecran>
  );
}

const s = StyleSheet.create({
  titre: { fontSize: 16, fontWeight: '600', color: couleurs.texte, flex: 1 },
});
