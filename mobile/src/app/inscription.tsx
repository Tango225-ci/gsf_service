import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { EcranConnexion, LienSousCarte } from '@/components/EcranConnexion';
import { ChampTelephone, SelecteurPays } from '@/components/Pays';
import { Bouton, CaseACocher, Champ, ChoixLigne, Groupe, Petit } from '@/components/ui';
import { PAYS, paysParCode, type Pays } from '@/lib/pays';

type Devise = 'EUR' | 'USD' | 'CAD' | 'XOF';

const PAYS_EURO = ['FR', 'BE', 'DE', 'IT', 'ES', 'PT', 'NL', 'LU', 'AT', 'IE', 'FI', 'GR'];
const PAYS_FCFA = ['CI', 'SN', 'BF', 'ML', 'BJ', 'TG', 'NE', 'GW', 'CM', 'GA', 'CG', 'TD', 'CF', 'GQ'];

/** Devise proposée selon le pays de résidence (modifiable). */
function deviseDuPays(code: string): Devise {
  if (code === 'US') return 'USD';
  if (code === 'CA') return 'CAD';
  if (PAYS_FCFA.includes(code)) return 'XOF';
  if (PAYS_EURO.includes(code)) return 'EUR';
  return 'EUR';
}

/** Retrouve le pays d'un numéro saisi à la connexion (« +33 6 12… » → France, « 6 12… »). */
function decouperNumero(saisie: string | undefined): { pays?: Pays; numero: string } {
  const brut = (saisie ?? '').trim();
  if (!brut.startsWith('+')) return { numero: brut };
  const chiffres = brut.replace(/[^\d+]/g, '');
  const candidats = PAYS.filter((p) => chiffres.startsWith(p.indicatif)).sort((a, b) => b.indicatif.length - a.indicatif.length);
  // L'indicatif +1 est partagé (Canada, États-Unis, Caraïbes) : on propose le Canada, modifiable
  const pays = candidats[0]?.indicatif === '+1' ? paysParCode('CA') : candidats[0];
  if (!pays) return { numero: brut };
  return { pays, numero: brut.slice(brut.indexOf(pays.indicatif) + pays.indicatif.length).trim() };
}

/**
 * Création du compte client : prénom, nom, pays de résidence, puis téléphone avec l'indicatif du pays.
 * Le numéro ou l'email saisi à la connexion est repris. Le compte est confirmé par un code.
 */
export default function Inscription() {
  const params = useLocalSearchParams<{ telephone?: string; email?: string }>();
  const depart = decouperNumero(params.telephone);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [pays, setPays] = useState<Pays | undefined>(depart.pays);
  const [numero, setNumero] = useState(depart.numero);
  const [email, setEmail] = useState(params.email ?? '');
  const [devise, setDevise] = useState<Devise>(depart.pays ? deviseDuPays(depart.pays.code) : 'EUR');
  const [accepte, setAccepte] = useState(false);

  const choisirPays = (p: Pays) => {
    setPays(p);
    setDevise(deviseDuPays(p.code));
  };

  const chiffres = numero.replace(/\D/g, '');
  const complet = prenom.trim() && nom.trim() && pays && chiffres.length >= 6 && accepte;
  const telephoneComplet = pays ? `${pays.indicatif} ${numero.trim()}` : '';

  return (
    <EcranConnexion
      titre="Créer mon compte"
      sousTitre="Gratuit, en une minute. Vous recevrez un code pour le confirmer."
      retour
      apresCarte={<LienSousCarte texte="Déjà inscrit ?" lien="Se connecter" onPress={() => router.back()} />}
    >
      <Champ libelle="Prénom" placeholder="Aïcha" value={prenom} onChangeText={setPrenom} autoComplete="given-name" />
      <Champ libelle="Nom" placeholder="Koné" value={nom} onChangeText={setNom} autoComplete="family-name" />
      <SelecteurPays libelle="Pays de résidence" valeur={pays?.code ?? null} onChange={choisirPays} />
      <ChampTelephone
        libelle="Numéro de téléphone"
        pays={pays}
        valeur={numero}
        onChange={setNumero}
        aide="Vous recevrez un code par SMS. Il sert aussi à joindre votre agent."
      />
      <Champ libelle="Adresse email (facultatif)" placeholder="vous@exemple.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <Groupe libelle="Afficher aussi les prix en">
        <ChoixLigne libelle="Euro (€)" actif={devise === 'EUR'} onPress={() => setDevise('EUR')} />
        <ChoixLigne libelle="Dollar américain ($)" actif={devise === 'USD'} onPress={() => setDevise('USD')} />
        <ChoixLigne libelle="Dollar canadien ($ CA)" actif={devise === 'CAD'} onPress={() => setDevise('CAD')} />
        <ChoixLigne libelle="FCFA seulement" actif={devise === 'XOF'} onPress={() => setDevise('XOF')} />
      </Groupe>
      <CaseACocher libelle="J'accepte les conditions d'utilisation et la politique de confidentialité" coche={accepte} onPress={() => setAccepte(!accepte)} />
      <Bouton titre="Créer mon compte" icone="arrow-forward" desactive={!complet} onPress={() => router.push(`/code?vers=${encodeURIComponent(telephoneComplet)}&nouveau=1`)} />
      <Petit>Vos données sont protégées (loi ivoirienne n° 2013-450 et RGPD). Vous pourrez supprimer votre compte à tout moment.</Petit>
    </EcranConnexion>
  );
}
