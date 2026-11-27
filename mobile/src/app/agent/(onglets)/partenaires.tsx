import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Carte, Ecran, Ligne, Petit, Puce, Puces, Vignette } from '@/components/ui';
import { BIENS_PARTENAIRES, VEHICULES_PARTENAIRES } from '@/lib/demo';
import { fcfa } from '@/lib/format';
import { couleurs } from '@/lib/theme';

/** Biens et véhicules des partenaires, à proposer aux clients. Prix affichés : prix client. */
export default function PartenairesAgent() {
  const [onglet, setOnglet] = useState<'residences' | 'vehicules'>('residences');

  return (
    <Ecran titre="Partenaires">
      <Puces>
        <Puce libelle={`Résidences · ${BIENS_PARTENAIRES.length}`} actif={onglet === 'residences'} onPress={() => setOnglet('residences')} />
        <Puce libelle={`Véhicules · ${VEHICULES_PARTENAIRES.length}`} actif={onglet === 'vehicules'} onPress={() => setOnglet('vehicules')} />
      </Puces>
      {onglet === 'residences'
        ? BIENS_PARTENAIRES.map((b) => (
            <Carte key={b.id}>
              <Vignette hauteur={80} />
              <Ligne>
                <Text style={s.nom}>{b.nom}</Text>
                <Text style={s.prix}>{fcfa(b.prix)} / nuit</Text>
              </Ligne>
              <Petit>
                {b.zone} · {b.details}
              </Petit>
              <Petit>Propriétaire : {b.proprietaire}</Petit>
            </Carte>
          ))
        : VEHICULES_PARTENAIRES.map((v) => (
            <Carte key={v.id}>
              <Ligne>
                <Text style={s.nom}>{v.nom}</Text>
                <Text style={s.prix}>{fcfa(v.prix)} / jour</Text>
              </Ligne>
              <Petit>{v.details}</Petit>
              <Petit>Loueur : {v.loueur}</Petit>
            </Carte>
          ))}
    </Ecran>
  );
}

const s = StyleSheet.create({
  nom: { fontSize: 16, fontWeight: '600', color: couleurs.texte, flex: 1 },
  prix: { fontSize: 14, fontWeight: '600', color: couleurs.marque },
});
