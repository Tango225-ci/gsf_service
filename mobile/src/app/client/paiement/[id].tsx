import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { Bouton, Carte, ChoixLigne, Ecran, Groupe, LigneMontant, Note, Petit } from '@/components/ui';
import { demande as trouverDemande, service as trouverService } from '@/lib/demo';
import { euros, fcfa } from '@/lib/format';
import { couleurs } from '@/lib/theme';

/** Exemple de frais de service GSF fixés par l'agent selon le volume (jamais un pourcentage). */
const FRAIS_GSF_SEJOUR = 75000;
const ACCUEIL_AEROPORT = 35000;
const ACOMPTE = 0.3;

/**
 * Maquette client 5 : récapitulatif et paiement.
 * - Demande avec propositions : acompte de 30 % sur les prestations proposées, prix fixe en totalité, frais GSF.
 * - Service à prix fixe seul (id « nouvelle ») : tout à la commande.
 * L'encaissement (lot 5) est mis de côté : le bouton « Payer » est inactif.
 */
export default function Paiement() {
  const { id, choix, service: slug, montant } = useLocalSearchParams<{ id: string; choix?: string; service?: string; montant?: string }>();
  const [moyen, setMoyen] = useState<'carte' | 'mobile'>('carte');

  const lignes: { libelle: string; montant: number }[] = [];
  let aPayer: number;
  let solde = 0;
  let fraisGsf: number;

  if (id === 'nouvelle') {
    const s = trouverService(slug ?? '');
    fraisGsf = s?.fraisGsf ?? 0;
    aPayer = Number(montant ?? 0);
    lignes.push({ libelle: s?.nom ?? 'Prestation', montant: aPayer - fraisGsf });
  } else {
    const d = trouverDemande(id);
    const choisies = (d?.propositions ?? []).filter((p) => (choix ?? '').split(',').includes(p.id));
    choisies.forEach((p) => lignes.push({ libelle: `${p.titre} · ${p.quantite} ${p.unite}s`, montant: p.prixUnitaire * p.quantite }));
    lignes.push({ libelle: 'Accueil aéroport · SUV (prix fixe)', montant: ACCUEIL_AEROPORT });
    fraisGsf = FRAIS_GSF_SEJOUR;
    const proposees = choisies.reduce((t, p) => t + p.prixUnitaire * p.quantite, 0);
    const acompte = Math.round(proposees * ACOMPTE);
    aPayer = acompte + ACCUEIL_AEROPORT + fraisGsf;
    solde = proposees - acompte;
  }
  const total = lignes.reduce((t, l) => t + l.montant, 0) + fraisGsf;
  const enTotalite = id === 'nouvelle';

  return (
    <Ecran
      titre={enTotalite ? 'Paiement' : "Paiement de l'acompte"}
      retour
      piedDePage={
        <>
          <Note texte="Paiement en ligne : à venir. Le prestataire de paiement n'est pas encore choisi." />
          <Bouton titre={`Payer ${fcfa(aPayer, ' FCFA')}`} desactive onPress={() => {}} />
        </>
      }
    >
      <Carte>
        {lignes.map((l) => (
          <LigneMontant key={l.libelle} libelle={l.libelle} montant={fcfa(l.montant)} />
        ))}
        <LigneMontant libelle="Frais de service GSF" montant={fcfa(fraisGsf)} />
        <LigneMontant libelle="Total" montant={fcfa(total, ' FCFA')} total fort />
        <LigneMontant libelle="Soit environ" montant={euros(total)} discret />
      </Carte>

      <Carte>
        {enTotalite ? (
          <LigneMontant libelle="À payer maintenant (prix fixe, en totalité)" montant={fcfa(aPayer)} fort />
        ) : (
          <>
            <LigneMontant libelle="Acompte résidence + véhicule (30 %)" montant={fcfa(aPayer - ACCUEIL_AEROPORT - fraisGsf)} />
            <LigneMontant libelle="Accueil aéroport (prix fixe, en totalité)" montant={fcfa(ACCUEIL_AEROPORT)} />
            <LigneMontant libelle="Frais de service GSF" montant={fcfa(fraisGsf)} />
            <LigneMontant libelle="À payer maintenant" montant={fcfa(aPayer)} total fort />
            <LigneMontant libelle="Solde à l'arrivée" montant={fcfa(solde)} />
          </>
        )}
      </Carte>

      <Groupe libelle="Moyen de paiement">
        <ChoixLigne libelle="Carte bancaire" actif={moyen === 'carte'} onPress={() => setMoyen('carte')} />
        <ChoixLigne libelle="Mobile Money (Orange, MTN, Moov, Wave)" actif={moyen === 'mobile'} onPress={() => setMoyen('mobile')} />
      </Groupe>
      <Petit>
        <Text style={{ color: couleurs.texte }}>Frais de service GSF</Text> : fixés par votre agent selon le volume de la prestation, payés à la commande.
        {enTotalite ? '' : ' Le solde ne couvre que la résidence et le véhicule.'}
      </Petit>
    </Ecran>
  );
}
