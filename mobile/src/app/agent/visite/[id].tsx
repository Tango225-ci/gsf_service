import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { Badge, Bouton, CaseACocher, Carte, Champ, Ecran, Groupe, Ligne, Petit, Puce, Puces } from '@/components/ui';
import { couleurs } from '@/lib/theme';

const CONTROLES = ['Photos des 4 bornes (4/4)', "Vue d'ensemble et vidéo", 'Accès et voisinage', 'Photo du panneau ou du lot'];

/** Maquette agent 5 : visite de terrain guidée (GPS, contrôles, questions). Le rapport se génère tout seul. */
export default function VisiteTerrain() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [gps, setGps] = useState(false);
  const [faits, setFaits] = useState<string[]>(CONTROLES.slice(0, 3));
  const [occupe, setOccupe] = useState<'Oui' | 'Non'>('Non');
  const [voisin, setVoisin] = useState<'Oui' | 'Non'>('Oui');
  const complet = gps && faits.length === CONTROLES.length;

  return (
    <Ecran
      titre="Visite de terrain"
      sousTitre={`GSF-2026-${id} · Bingerville · lot 112`}
      retour
      piedDePage={<Bouton titre="Envoyer le rapport au client" desactive={!complet} onPress={() => router.back()} />}
    >
      <Carte>
        <Ligne>
          <Text style={{ fontSize: 15, fontWeight: '600', color: couleurs.texte }}>Position GPS</Text>
          <Badge texte={gps ? 'Capturée' : 'À capturer'} ton={gps ? 'marque' : 'accent'} />
        </Ligne>
        {gps ? <Petit>5.3561 N · 3.8912 O · précision 4 m</Petit> : <Bouton titre="Capturer la position" petit variante="secondaire" icone="locate-outline" onPress={() => setGps(true)} />}
      </Carte>

      <Groupe libelle="Contrôles">
        {CONTROLES.map((c) => (
          <CaseACocher key={c} libelle={c} coche={faits.includes(c)} onPress={() => setFaits((f) => (f.includes(c) ? f.filter((x) => x !== c) : [...f, c]))} />
        ))}
      </Groupe>
      <Groupe libelle="Terrain occupé ?">
        <Puces>
          {(['Oui', 'Non'] as const).map((v) => (
            <Puce key={v} libelle={v} actif={occupe === v} onPress={() => setOccupe(v)} />
          ))}
        </Puces>
      </Groupe>
      <Groupe libelle="Construction voisine en limite ?">
        <Puces>
          {(['Oui', 'Non'] as const).map((v) => (
            <Puce key={v} libelle={v} actif={voisin === v} onPress={() => setVoisin(v)} />
          ))}
        </Puces>
      </Groupe>
      <Champ libelle="Observations" multiline defaultValue="Clôture voisine commencée en limite nord." />
      {!complet && <Petit>Capturez la position et cochez tous les contrôles pour envoyer le rapport.</Petit>}
    </Ecran>
  );
}
