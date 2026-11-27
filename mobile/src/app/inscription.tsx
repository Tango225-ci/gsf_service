import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Bouton, CaseACocher, Champ, ChoixLigne, Ecran, Groupe, Petit } from '@/components/ui';

/**
 * Création du compte client. Le numéro ou l'email saisi à la connexion est repris.
 * Le compte est confirmé par un code envoyé par SMS ou email.
 */
export default function Inscription() {
  const params = useLocalSearchParams<{ telephone?: string; email?: string }>();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState(params.telephone ?? '');
  const [email, setEmail] = useState(params.email ?? '');
  const [pays, setPays] = useState('');
  const [devise, setDevise] = useState('EUR');
  const [accepte, setAccepte] = useState(false);

  const complet = prenom.trim() && nom.trim() && (telephone.trim().length >= 8 || email.includes('@')) && accepte;
  const vers = telephone.trim() || email.trim();

  return (
    <Ecran
      titre="Créer mon compte"
      sousTitre="Gratuit, en une minute"
      retour
      piedDePage={<Bouton titre="Créer mon compte" desactive={!complet} onPress={() => router.push(`/code?vers=${encodeURIComponent(vers)}&nouveau=1`)} />}
    >
      <Champ libelle="Prénom" placeholder="Aïcha" value={prenom} onChangeText={setPrenom} autoComplete="given-name" />
      <Champ libelle="Nom" placeholder="Koné" value={nom} onChangeText={setNom} autoComplete="family-name" />
      <Champ libelle="Numéro de téléphone" placeholder="+33 6 12 34 56 78" keyboardType="phone-pad" value={telephone} onChangeText={setTelephone} aide="Avec l'indicatif du pays. Sert à vous connecter et à joindre votre agent." />
      <Champ libelle="Adresse email (facultatif)" placeholder="vous@exemple.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <Champ libelle="Pays de résidence" placeholder="France, Côte d'Ivoire, Canada…" value={pays} onChangeText={setPays} />
      <Groupe libelle="Afficher aussi les prix en">
        <ChoixLigne libelle="Euro (€)" actif={devise === 'EUR'} onPress={() => setDevise('EUR')} />
        <ChoixLigne libelle="Dollar américain ($)" actif={devise === 'USD'} onPress={() => setDevise('USD')} />
        <ChoixLigne libelle="Dollar canadien ($ CA)" actif={devise === 'CAD'} onPress={() => setDevise('CAD')} />
        <ChoixLigne libelle="FCFA seulement" actif={devise === 'XOF'} onPress={() => setDevise('XOF')} />
      </Groupe>
      <CaseACocher libelle="J'accepte les conditions d'utilisation et la politique de confidentialité" coche={accepte} onPress={() => setAccepte(!accepte)} />
      <Petit>Vos données sont protégées (loi ivoirienne n° 2013-450 et RGPD). Vous pourrez supprimer votre compte à tout moment.</Petit>
    </Ecran>
  );
}
