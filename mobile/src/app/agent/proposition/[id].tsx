import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Bouton, Carte, Champ, ChoixLigne, Ecran, Groupe, LigneMontant, Petit, Puce, Puces, Vignettes } from '@/components/ui';
import { BIENS_PARTENAIRES, VEHICULES_PARTENAIRES } from '@/lib/demo';
import { fcfa } from '@/lib/format';

/** Maquette agent 2 : créer une proposition. Frais GSF fixés selon le volume, acompte ajustable. */
export default function NouvelleProposition() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [type, setType] = useState<'residence' | 'vehicule'>('residence');
  const biens = type === 'residence' ? BIENS_PARTENAIRES.map((b) => ({ id: b.id, nom: `${b.nom} · ${b.proprietaire}`, prix: b.prix })) : VEHICULES_PARTENAIRES.map((v) => ({ id: v.id, nom: `${v.nom} · ${v.loueur}`, prix: v.prix }));
  const [bien, setBien] = useState(biens[0].id);
  const [prix, setPrix] = useState(String(biens[0].prix));
  const [quantite, setQuantite] = useState('12');
  const [frais, setFrais] = useState('40000');
  const [acompte, setAcompte] = useState('30');

  const choisir = (b: { id: string; prix: number }) => {
    setBien(b.id);
    setPrix(String(b.prix));
  };
  const prestation = Number(prix || 0) * Number(quantite || 0);
  const fraisGsf = Number(frais || 0);
  const montantAcompte = Math.round((prestation * Number(acompte || 0)) / 100);

  return (
    <Ecran
      titre="Nouvelle proposition"
      sousTitre={`GSF-2026-${id}`}
      retour
      piedDePage={<Bouton titre="Envoyer au client" icone="send" onPress={() => router.back()} />}
    >
      <Puces>
        <Puce libelle="Résidence" actif={type === 'residence'} onPress={() => { setType('residence'); choisir(BIENS_PARTENAIRES[0]); }} />
        <Puce libelle="Véhicule" actif={type === 'vehicule'} onPress={() => { setType('vehicule'); choisir(VEHICULES_PARTENAIRES[0]); }} />
      </Puces>
      <Groupe libelle={type === 'residence' ? 'Bien du partenaire' : 'Véhicule du partenaire'}>
        {biens.map((b) => (
          <ChoixLigne key={b.id} libelle={b.nom} actif={bien === b.id} onPress={() => choisir(b)} />
        ))}
      </Groupe>
      <Groupe libelle="Photos">
        <Vignettes nombre={3} ajout />
      </Groupe>
      <View style={s.deux}>
        <View style={{ flex: 1 }}>
          <Champ libelle={type === 'residence' ? 'Prix / nuit' : 'Prix / jour'} value={prix} onChangeText={setPrix} keyboardType="number-pad" />
        </View>
        <View style={{ flex: 1 }}>
          <Champ libelle={type === 'residence' ? 'Nuits' : 'Jours'} value={quantite} onChangeText={setQuantite} keyboardType="number-pad" />
        </View>
      </View>
      <Champ libelle="Frais de service GSF" aide="Selon le volume de la prestation. Jamais en pourcentage." value={frais} onChangeText={setFrais} keyboardType="number-pad" />
      <Champ libelle="Acompte (%)" aide="30 % par défaut, modifiable." value={acompte} onChangeText={setAcompte} keyboardType="number-pad" />
      <Champ libelle="Valable jusqu'au" value="02/12/2026" />

      <Carte>
        <LigneMontant libelle="Prestation" montant={fcfa(prestation)} />
        <LigneMontant libelle="Frais de service GSF" montant={fcfa(fraisGsf)} />
        <LigneMontant libelle="Total" montant={fcfa(prestation + fraisGsf, ' FCFA')} total fort />
        <LigneMontant libelle={`Acompte · ${acompte || 0} %`} montant={fcfa(montantAcompte)} />
      </Carte>
      <Petit>Le prix payé au partenaire et la marge ne sont jamais montrés au client.</Petit>
    </Ecran>
  );
}

const s = StyleSheet.create({
  deux: { flexDirection: 'row', gap: 10 },
});
