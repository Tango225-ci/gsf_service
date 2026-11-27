import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EcranConnexion, LienSousCarte } from '@/components/EcranConnexion';
import { Bouton, Petit } from '@/components/ui';
import { compteDemo } from '@/lib/demo';
import { useSession } from '@/lib/session';
import { couleurs, rayons } from '@/lib/theme';

const LONGUEUR = 6;

/**
 * Saisie du code reçu par SMS ou email, pour se connecter ou pour confirmer un nouveau compte.
 * En démonstration, n'importe quel code à 6 chiffres passe.
 */
export default function SaisieCode() {
  const { vers, nouveau } = useLocalSearchParams<{ vers: string; nouveau?: string }>();
  const { entrerEnDemo } = useSession();
  const [code, setCode] = useState('');
  const champ = useRef<React.ComponentRef<typeof TextInput>>(null);

  return (
    <EcranConnexion
      titre={nouveau ? 'Confirmer mon compte' : 'Code de connexion'}
      retour
      apresCarte={<LienSousCarte texte="Pas reçu de code ?" lien="Renvoyer" onPress={() => setCode('')} />}
    >
      <Petit style={{ fontSize: 15, lineHeight: 22 }}>
        Saisissez le code à 6 chiffres envoyé à <Text style={{ color: couleurs.texte, fontWeight: '600' }}>{vers}</Text>.
      </Petit>
      <Pressable onPress={() => champ.current?.focus()} style={s.cases} accessibilityLabel="Code à 6 chiffres">
        {Array.from({ length: LONGUEUR }).map((_, i) => (
          <View key={i} style={[s.case, i === code.length && s.caseActive]}>
            <Text style={s.chiffre}>{code[i] ?? ''}</Text>
          </View>
        ))}
      </Pressable>
      <TextInput
        ref={champ}
        value={code}
        onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, LONGUEUR))}
        keyboardType="number-pad"
        autoFocus
        textContentType="oneTimeCode"
        style={s.cache}
      />
      <Bouton
        icone="arrow-forward"
        titre={nouveau ? 'Confirmer et entrer' : 'Se connecter'}
        desactive={code.length < LONGUEUR}
        onPress={() => {
          // Démonstration : le rôle vient du compte saisi ; un nouveau compte est toujours un client
          const compte = nouveau ? undefined : compteDemo(vers ?? '');
          const [prenom, ...reste] = (compte?.nom ?? '').split(' ');
          entrerEnDemo(compte?.role ?? 'client', compte ? prenom : undefined, compte ? reste.join(' ') : undefined);
        }}
      />
    </EcranConnexion>
  );
}

const s = StyleSheet.create({
  cases: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginVertical: 4 },
  case: { width: 44, height: 56, borderRadius: rayons.moyen, borderWidth: 1, borderColor: couleurs.bordure, backgroundColor: couleurs.carte, alignItems: 'center', justifyContent: 'center' },
  caseActive: { borderColor: couleurs.marque, borderWidth: 2 },
  chiffre: { fontSize: 24, fontWeight: '700', color: couleurs.texte },
  cache: { position: 'absolute', opacity: 0, height: 1, width: 1 },
});
