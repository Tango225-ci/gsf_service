import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Logo } from '@/components/Logo';
import { Badge, Bouton, Carte, Champ, Ecran, Petit, Puce, Puces } from '@/components/ui';
import { COMPTES_DEMO, estInscrit } from '@/lib/demo';
import { useSession } from '@/lib/session';
import { couleurs } from '@/lib/theme';

/**
 * Fenêtre de connexion. Le client saisit son numéro ou son email :
 * - déjà inscrit : il reçoit un code ;
 * - pas encore inscrit : on lui propose de créer son compte.
 * (Démonstration : seuls les comptes de COMPTES_DEMO sont « inscrits ».)
 */
export default function Connexion() {
  const { entrerEnDemo } = useSession();
  const [mode, setMode] = useState<'telephone' | 'email'>('telephone');
  const [valeur, setValeur] = useState('');
  const [inconnu, setInconnu] = useState(false);

  const changerMode = (m: 'telephone' | 'email') => {
    setMode(m);
    setValeur('');
    setInconnu(false);
  };

  const continuer = () => {
    if (estInscrit(valeur)) router.push(`/code?vers=${encodeURIComponent(valeur.trim())}`);
    else setInconnu(true);
  };

  const creerCompte = () => router.push(`/inscription?${mode}=${encodeURIComponent(valeur.trim())}`);

  return (
    <Ecran>
      <View style={s.entete}>
        <Logo largeur={220} />
        <Text style={s.slogan}>Votre conciergerie en Côte d'Ivoire, même à distance.</Text>
      </View>

      <Text style={s.titre}>Se connecter</Text>
      <Puces>
        <Puce libelle="Téléphone" actif={mode === 'telephone'} onPress={() => changerMode('telephone')} />
        <Puce libelle="Email" actif={mode === 'email'} onPress={() => changerMode('email')} />
      </Puces>
      {mode === 'telephone' ? (
        <Champ
          libelle="Numéro de téléphone"
          placeholder="+33 6 12 34 56 78"
          keyboardType="phone-pad"
          value={valeur}
          onChangeText={(t) => {
            setValeur(t);
            setInconnu(false);
          }}
          aide="Avec l'indicatif du pays. Vous recevrez un code par SMS."
        />
      ) : (
        <Champ
          libelle="Adresse email"
          placeholder="vous@exemple.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={valeur}
          onChangeText={(t) => {
            setValeur(t);
            setInconnu(false);
          }}
          aide="Vous recevrez un code par email."
        />
      )}

      {inconnu ? (
        <Carte style={s.inconnu}>
          <Text style={s.inconnuTitre}>Vous n'avez pas encore de compte</Text>
          <Petit>
            Aucun compte n'est associé à {mode === 'telephone' ? 'ce numéro' : 'cette adresse'}. Créez votre compte pour commander les services GSF.
          </Petit>
          <Bouton titre="Créer mon compte" onPress={creerCompte} />
          <Bouton titre={`Corriger ${mode === 'telephone' ? 'le numéro' : "l'adresse"}`} variante="discret" petit onPress={() => setInconnu(false)} />
        </Carte>
      ) : (
        <Bouton titre="Recevoir un code" desactive={valeur.trim().length < 5} onPress={continuer} />
      )}

      <View style={s.separateur}>
        <View style={s.trait} />
        <Text style={s.ou}>Pas encore inscrit ?</Text>
        <View style={s.trait} />
      </View>
      <Bouton titre="Créer un compte" variante="secondaire" icone="person-add-outline" onPress={() => router.push('/inscription')} />

      {__DEV__ && (
        <Carte style={{ marginTop: 24 }}>
          <Text style={s.titreDemo}>Comptes de démonstration</Text>
          <Petit>Touchez un compte pour remplir l'email, puis « Recevoir un code ». N'importe quel code à 6 chiffres fonctionne.</Petit>
          {COMPTES_DEMO.map((c) => (
            <Pressable
              key={c.identifiants[1]}
              accessibilityRole="button"
              onPress={() => {
                changerMode('email');
                setValeur(c.identifiants[1]);
              }}
              style={({ pressed }) => [s.compte, pressed && { opacity: 0.7 }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={s.compteNom}>{c.nom}</Text>
                <Petit>
                  {c.description} · {c.identifiants[1]}
                </Petit>
              </View>
              <Badge texte={c.role === 'coordinateur' ? 'Coordinateur' : c.role === 'agent' ? 'Agent' : 'Client'} ton={c.role === 'client' ? 'marque' : 'accent'} />
            </Pressable>
          ))}
          <Bouton titre="Entrer sans code (client)" variante="discret" petit onPress={() => entrerEnDemo('client', 'Aïcha', 'Koné')} />
        </Carte>
      )}
    </Ecran>
  );
}

const s = StyleSheet.create({
  entete: { alignItems: 'center', paddingTop: 32, paddingBottom: 16, gap: 12 },
  slogan: { fontSize: 15, color: couleurs.discret, textAlign: 'center' },
  titre: { fontSize: 22, fontWeight: '700', color: couleurs.texte },
  inconnu: { borderColor: couleurs.marque, borderWidth: 2, gap: 10 },
  inconnuTitre: { fontSize: 16, fontWeight: '700', color: couleurs.texte },
  separateur: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  trait: { flex: 1, height: 1, backgroundColor: couleurs.bordure },
  ou: { fontSize: 13, color: couleurs.discret },
  titreDemo: { fontSize: 15, fontWeight: '600', color: couleurs.texte },
  compte: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: couleurs.bordure },
  compteNom: { fontSize: 15, fontWeight: '600', color: couleurs.texte },
});
