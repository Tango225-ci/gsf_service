import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Bouton, Carte, Ecran, Ligne, Petit, TitreSection, Vignette } from '@/components/ui';
import { demande as trouverDemande, type Proposition } from '@/lib/demo';
import { fcfa } from '@/lib/format';
import { couleurs } from '@/lib/theme';

/** Maquette client 4 : le client compare les options de chaque prestation et en choisit une. */
export default function Propositions() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const demande = trouverDemande(id);
  const propositions = demande?.propositions ?? [];
  const prestations = [...new Set(propositions.map((p) => p.prestation))];
  const [choix, setChoix] = useState<Record<string, string>>({});
  const complet = prestations.every((p) => choix[p]);

  return (
    <Ecran
      titre="Propositions"
      sousTitre={demande ? `${demande.titre} · expirent le ${demande.expirationPropositions}` : undefined}
      retour
      piedDePage={
        <Bouton
          titre={complet ? "Continuer vers l'acompte" : `Choisissez ${prestations.filter((p) => !choix[p]).join(' et ').toLowerCase()}`}
          desactive={!complet}
          onPress={() => router.push(`/client/paiement/${id}?choix=${Object.values(choix).join(',')}`)}
        />
      }
    >
      {prestations.map((prestation) => (
        <View key={prestation} style={{ gap: 10 }}>
          <TitreSection titre={prestation} />
          {propositions
            .filter((p) => p.prestation === prestation)
            .map((p) => (
              <CarteProposition key={p.id} proposition={p} choisie={choix[prestation] === p.id} onChoisir={() => setChoix((c) => ({ ...c, [prestation]: p.id }))} />
            ))}
        </View>
      ))}
      <Petit style={{ textAlign: 'center' }}>L'accueil à l'aéroport, à prix fixe, n'a pas besoin de proposition.</Petit>
      <Bouton titre="Aucune option ne convient ? Demander d'autres propositions" variante="discret" petit onPress={() => router.push('/client/conversation/c1')} />
    </Ecran>
  );
}

function CarteProposition({ proposition: p, choisie, onChoisir }: { proposition: Proposition; choisie: boolean; onChoisir: () => void }) {
  return (
    <Carte style={choisie && s.choisie}>
      {p.photo && <Vignette hauteur={90} />}
      <Ligne>
        <Text style={s.titre}>{p.titre}</Text>
        <Badge texte={p.option} ton={choisie ? 'marque' : 'neutre'} />
      </Ligne>
      <Petit>{p.details}</Petit>
      <Ligne>
        <Text style={s.prix}>
          {fcfa(p.prixUnitaire, ' FCFA')} / {p.unite}
        </Text>
        <Petit>
          {p.quantite} {p.unite}s · {fcfa(p.prixUnitaire * p.quantite)}
        </Petit>
      </Ligne>
      <Bouton titre={choisie ? 'Choisie' : 'Choisir'} icone={choisie ? 'checkmark' : undefined} petit variante={choisie ? 'principal' : 'secondaire'} onPress={onChoisir} />
    </Carte>
  );
}

const s = StyleSheet.create({
  choisie: { borderColor: couleurs.marque, borderWidth: 2 },
  titre: { fontSize: 16, fontWeight: '600', color: couleurs.texte, flex: 1 },
  prix: { fontSize: 16, fontWeight: '700', color: couleurs.marque },
});
