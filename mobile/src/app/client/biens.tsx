import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Badge, Bouton, Carte, Champ, Ecran, Ligne, Petit } from '@/components/ui';
import { TERRAINS } from '@/lib/demo';
import { couleurs } from '@/lib/theme';

/** « Mes biens » : les terrains du client, enregistrés une fois, réutilisés par toutes ses demandes foncières. */
export default function MesBiens() {
  const [ajout, setAjout] = useState(false);

  return (
    <Ecran titre="Mes biens" retour>
      <Petit>Vos terrains en Côte d'Ivoire. Chaque demande foncière s'y rattache, avec ses documents.</Petit>
      {TERRAINS.map((t) => (
        <Carte key={t.id}>
          <Ligne>
            <Text style={s.titre}>{t.libelle}</Text>
            {t.demandes > 0 && <Badge texte={`${t.demandes} demande`} />}
          </Ligne>
          <Petit>
            {t.lieu} · {t.surface}
          </Petit>
          <Petit>Document : {t.document}</Petit>
          <Ligne>
            <Bouton titre="Visite de terrain" petit variante="secondaire" style={{ flex: 1 }} onPress={() => router.push('/client/nouvelle-demande?service=visite-terrain')} />
            <Bouton titre="Dossier ACD" petit variante="secondaire" style={{ flex: 1 }} onPress={() => router.push('/client/nouvelle-demande?service=dossier-acd')} />
          </Ligne>
        </Carte>
      ))}

      {ajout ? (
        <Carte>
          <Text style={s.titre}>Nouveau terrain</Text>
          <Champ libelle="Nom" placeholder="Mon terrain de Bingerville" />
          <Champ libelle="Ville ou commune" placeholder="Bingerville" />
          <Champ libelle="Lot et îlot" placeholder="Lot 112, îlot 8" />
          <Champ libelle="Surface (facultatif)" placeholder="500 m²" />
          <Champ libelle="Document du terrain" placeholder="Attestation villageoise, lettre d'attribution, ACD…" />
          <Bouton titre="Ajouter les documents" petit variante="secondaire" icone="document-attach-outline" onPress={() => {}} />
          <Bouton titre="Enregistrer le terrain" onPress={() => setAjout(false)} />
        </Carte>
      ) : (
        <Bouton titre="Ajouter un terrain" icone="add" onPress={() => setAjout(true)} />
      )}
    </Ecran>
  );
}

const s = StyleSheet.create({
  titre: { fontSize: 16, fontWeight: '600', color: couleurs.texte, flex: 1 },
});
