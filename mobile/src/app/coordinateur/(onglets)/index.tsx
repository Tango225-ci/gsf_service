import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Badge, Carte, Ecran, Ligne, Petit, Puce, Puces } from '@/components/ui';
import { A_AFFECTER, CATEGORIES } from '@/lib/demo';
import { couleurs } from '@/lib/theme';

/** Maquette coordinateur 1 : toutes les nouvelles demandes, les plus urgentes en haut. */
export default function DemandesAAffecter() {
  const [filtre, setFiltre] = useState<'tout' | 'sejour' | 'demarches' | 'foncier'>('tout');
  const liste = A_AFFECTER.filter((d) => filtre === 'tout' || d.categorie === filtre);

  return (
    <Ecran titre="À affecter" sousTitre={`${A_AFFECTER.length} demandes · 23 affectées · 1 en retard`}>
      <Puces>
        <Puce libelle="Tout" actif={filtre === 'tout'} onPress={() => setFiltre('tout')} />
        <Puce libelle="Séjour" actif={filtre === 'sejour'} onPress={() => setFiltre('sejour')} />
        <Puce libelle="Démarches" actif={filtre === 'demarches'} onPress={() => setFiltre('demarches')} />
        <Puce libelle="Foncier" actif={filtre === 'foncier'} onPress={() => setFiltre('foncier')} />
      </Puces>
      {liste.map((d) => (
        <Carte key={d.id} bande={d.urgente ? couleurs.accent : couleurs.marque} onPress={() => router.push(`/coordinateur/affecter/${d.id}`)}>
          <Ligne>
            <Text style={s.titre}>{d.titre}</Text>
            <Badge texte={d.badge} ton={d.urgente ? 'accent' : 'neutre'} />
          </Ligne>
          <Petit>
            {d.numero} · {d.detail}
          </Petit>
          <Ligne>
            <Petit>{d.client}</Petit>
            <Petit>{d.recue}</Petit>
          </Ligne>
          <Petit style={{ color: couleurs.marque }}>{CATEGORIES[d.categorie].nom}</Petit>
        </Carte>
      ))}
    </Ecran>
  );
}

const s = StyleSheet.create({
  titre: { fontSize: 16, fontWeight: '600', color: couleurs.texte, flex: 1 },
});
