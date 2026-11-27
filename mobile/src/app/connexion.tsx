import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EcranConnexion, LienSousCarte, Segments } from '@/components/EcranConnexion';
import { ChampTelephone, SelecteurPays } from '@/components/Pays';
import { Badge, Bouton, Carte, Champ, Petit } from '@/components/ui';
import { COMPTES_DEMO, estInscrit } from '@/lib/demo';
import { paysParCode, type Pays } from '@/lib/pays';
import { useSession } from '@/lib/session';
import { couleurs } from '@/lib/theme';

type Mode = 'telephone' | 'email';

/**
 * Fenêtre de connexion. Le client saisit son numéro ou son email :
 * - déjà inscrit : il reçoit un code ;
 * - pas encore inscrit : on lui propose de créer son compte.
 * (Démonstration : seuls les comptes de COMPTES_DEMO sont « inscrits ».)
 */
export default function Connexion() {
  const { entrerEnDemo } = useSession();
  const [mode, setMode] = useState<Mode>('telephone');
  const [pays, setPays] = useState<Pays | undefined>(paysParCode('CI'));
  const [numero, setNumero] = useState('');
  const [email, setEmail] = useState('');
  const [inconnu, setInconnu] = useState(false);

  const changerMode = (m: Mode) => {
    setMode(m);
    setInconnu(false);
  };

  // Numéro complet, indicatif compris : « +225 07 00 00 00 11 »
  const valeur = mode === 'telephone' ? (pays && numero.trim() ? `${pays.indicatif} ${numero.trim()}` : '') : email.trim();
  const valide = mode === 'telephone' ? numero.replace(/\D/g, '').length >= 6 : /\S+@\S+\.\S+/.test(email);

  const continuer = () => {
    if (estInscrit(valeur)) router.push(`/code?vers=${encodeURIComponent(valeur)}`);
    else setInconnu(true);
  };

  const creerCompte = () => router.push(`/inscription?${mode}=${encodeURIComponent(valeur)}`);

  return (
    <EcranConnexion
      titre="Se connecter"
      sousTitre="Nous vous envoyons un code de connexion."
      slogan
      apresCarte={
        <>
          <LienSousCarte texte="Pas encore inscrit ?" lien="Créer un compte" onPress={() => router.push('/inscription')} />
          {__DEV__ && (
            <Carte style={{ marginTop: 8 }}>
              <Text style={s.titreDemo}>Comptes de démonstration</Text>
              <Petit>Touchez un compte pour remplir l'email, puis « Recevoir un code ». N'importe quel code à 6 chiffres fonctionne.</Petit>
              {COMPTES_DEMO.map((c) => (
                <Pressable
                  key={c.identifiants[1]}
                  accessibilityRole="button"
                  onPress={() => {
                    changerMode('email');
                    setEmail(c.identifiants[1]);
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
        </>
      }
    >
      <Segments<Mode>
        valeur={mode}
        onChange={changerMode}
        options={[
          { valeur: 'telephone', libelle: 'Téléphone', icone: 'call-outline' },
          { valeur: 'email', libelle: 'Email', icone: 'mail-outline' },
        ]}
      />

      {mode === 'telephone' ? (
        <>
          <SelecteurPays
            libelle="Pays du numéro"
            valeur={pays?.code ?? null}
            onChange={(p) => {
              setPays(p);
              setInconnu(false);
            }}
          />
          <ChampTelephone
            libelle="Numéro de téléphone"
            pays={pays}
            valeur={numero}
            onChange={(t) => {
              setNumero(t);
              setInconnu(false);
            }}
            aide="Vous recevrez un code par SMS."
          />
        </>
      ) : (
        <Champ
          libelle="Adresse email"
          placeholder="vous@exemple.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setInconnu(false);
          }}
          aide="Vous recevrez un code par email."
        />
      )}

      {inconnu ? (
        <View style={s.inconnu}>
          <View style={s.inconnuTete}>
            <Ionicons name="person-add" size={20} color={couleurs.marque} />
            <Text style={s.inconnuTitre}>Vous n'avez pas encore de compte</Text>
          </View>
          <Petit>
            Aucun compte n'est associé à {mode === 'telephone' ? 'ce numéro' : 'cette adresse'}. Créez votre compte pour commander les services GSF.
          </Petit>
          <Bouton titre="Créer mon compte" onPress={creerCompte} />
          <Bouton titre={`Corriger ${mode === 'telephone' ? 'le numéro' : "l'adresse"}`} variante="discret" petit onPress={() => setInconnu(false)} />
        </View>
      ) : (
        <Bouton titre="Recevoir un code" icone="arrow-forward" desactive={!valide} onPress={continuer} />
      )}
    </EcranConnexion>
  );
}

const s = StyleSheet.create({
  inconnu: { backgroundColor: couleurs.marqueClair, borderRadius: 14, padding: 14, gap: 10 },
  inconnuTete: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inconnuTitre: { fontSize: 16, fontWeight: '700', color: couleurs.texte, flex: 1 },
  titreDemo: { fontSize: 15, fontWeight: '600', color: couleurs.texte },
  compte: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: couleurs.bordure },
  compteNom: { fontSize: 15, fontWeight: '600', color: couleurs.texte },
});
