import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Badge, Bouton, Carte, Ecran, Ligne, Petit, Puce, Puces } from '@/components/ui';
import { DEMANDES } from '@/lib/demo';
import { couleurs } from '@/lib/theme';

/** Liste des demandes du client, en cours ou terminées. */
export default function DemandesClient() {
  const [filtre, setFiltre] = useState<'encours' | 'terminees'>('encours');
  const liste = DEMANDES.filter((d) => (filtre === 'terminees') === (d.couleur === 'discret'));

  return (
    <Ecran titre="Mes demandes">
      <Puces>
        <Puce libelle="En cours" actif={filtre === 'encours'} onPress={() => setFiltre('encours')} />
        <Puce libelle="Terminées" actif={filtre === 'terminees'} onPress={() => setFiltre('terminees')} />
      </Puces>
      {liste.map((d) => (
        <Carte key={d.id} onPress={() => router.push(`/client/demande/${d.id}`)} bande={d.couleur === 'accent' ? couleurs.accent : d.couleur === 'discret' ? couleurs.bordure : couleurs.marque}>
          <Ligne>
            <Text style={s.titre}>{d.titre}</Text>
            <Badge texte={d.statut} ton={d.couleur === 'accent' ? 'accent' : d.couleur === 'discret' ? 'neutre' : 'marque'} />
          </Ligne>
          <Petit>{d.resume}</Petit>
          <Petit style={s.numero}>{d.numero}</Petit>
        </Carte>
      ))}
      <Bouton titre="Nouvelle demande" icone="add" variante="secondaire" onPress={() => router.push('/client')} />
    </Ecran>
  );
}

const s = StyleSheet.create({
  titre: { fontSize: 16, fontWeight: '600', color: couleurs.texte, flex: 1 },
  numero: { fontFamily: 'monospace', fontSize: 12 },
});
