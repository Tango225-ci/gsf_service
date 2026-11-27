import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Bouton, Carte, Champ, Ecran, Groupe, LigneMontant, Note, Petit, Puce, Puces, Vignettes } from '@/components/ui';
import { fcfa } from '@/lib/format';
import { couleurs } from '@/lib/theme';

const NIVEAUX = ['Vide', '1/4', '1/2', '3/4', 'Plein'];

/**
 * Maquette agent 4 : remise du véhicule avec état des lieux en photos.
 * L'encaissement du solde (lot 5) est mis de côté : le montant est affiché, sans encaissement.
 */
export default function RemiseVehicule() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [photos, setPhotos] = useState(3);
  const [carburant, setCarburant] = useState('3/4');
  const [signe, setSigne] = useState(false);

  return (
    <Ecran
      titre="Remise du véhicule"
      sousTitre={`GSF-2026-${id} · Toyota RAV4 · 5 jours`}
      retour
      piedDePage={<Bouton titre="Valider la remise" desactive={!signe || photos < 5} onPress={() => router.back()} />}
    >
      <Groupe libelle="Photos (4 côtés + intérieur)">
        <Vignettes nombre={photos} ajout onAjout={() => setPhotos((p) => p + 1)} />
        <Petit>{photos < 5 ? `Encore ${5 - photos} photo(s) à prendre.` : 'Toutes les photos sont prises.'}</Petit>
      </Groupe>
      <Champ libelle="Kilométrage" defaultValue="48 210" keyboardType="number-pad" />
      <Groupe libelle="Carburant">
        <View style={s.jauge}>
          <View style={[s.niveau, { width: `${(NIVEAUX.indexOf(carburant) / 4) * 100}%` }]} />
        </View>
        <Puces>
          {NIVEAUX.map((n) => (
            <Puce key={n} libelle={n} actif={carburant === n} onPress={() => setCarburant(n)} />
          ))}
        </Puces>
      </Groupe>
      <Champ libelle="Remarques" multiline placeholder="Rayure légère sur le pare-choc arrière…" />

      <Carte>
        <LigneMontant libelle="Solde à encaisser" montant={fcfa(122500, ' FCFA')} fort />
      </Carte>
      <Note texte="Encaissement du solde : à venir. Il sera ajouté avec le module de paiement." />

      <Bouton
        titre={signe ? 'Signé par le client' : 'Faire signer le client'}
        icone={signe ? 'checkmark-circle' : 'create-outline'}
        variante={signe ? 'principal' : 'secondaire'}
        onPress={() => setSigne(true)}
      />
      <Petit style={{ textAlign: 'center' }}>Le client signe à l'écran et reçoit l'état des lieux.</Petit>
    </Ecran>
  );
}

const s = StyleSheet.create({
  jauge: { height: 10, borderRadius: 5, backgroundColor: couleurs.bordure, overflow: 'hidden' },
  niveau: { height: '100%', backgroundColor: couleurs.marque },
});
