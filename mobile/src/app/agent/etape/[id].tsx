import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Bascule, Bouton, Champ, ChoixLigne, Ecran, Groupe, Note, Petit, Vignettes } from '@/components/ui';

const ETAPES = ['Déposé à la mairie', 'En traitement', 'Retrait du document', 'Remise au client'];

/** Maquette agent 3 : mise à jour d'étape avec photo du récépissé, commentaire, notification au client. */
export default function MiseAJourEtape() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [etape, setEtape] = useState('En traitement');
  const [visible, setVisible] = useState(true);
  const [photos, setPhotos] = useState(1);

  return (
    <Ecran
      titre="Mettre à jour"
      sousTitre={`GSF-2026-${id}`}
      retour
      piedDePage={<Bouton titre="Publier la mise à jour" onPress={() => router.back()} />}
    >
      <Petit>Étape actuelle : Déposé à la mairie</Petit>
      <Groupe libelle="Nouvelle étape">
        {ETAPES.map((e) => (
          <ChoixLigne key={e} libelle={e} actif={etape === e} onPress={() => setEtape(e)} />
        ))}
      </Groupe>
      <Champ libelle="Commentaire" multiline defaultValue="Dossier enregistré, retrait prévu jeudi selon l'agent de l'état civil." />
      <Groupe libelle="Preuves">
        <Vignettes nombre={photos} ajout onAjout={() => setPhotos((p) => p + 1)} />
      </Groupe>
      <Bascule libelle="Visible par le client" valeur={visible} onChange={setVisible} />
      <Note ton="neutre" texte="Hors réseau : la mise à jour partira dès le retour de la connexion." />
    </Ecran>
  );
}
