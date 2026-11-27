import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Bouton, CaseACocher, Carte, Champ, ChoixLigne, Ecran, Groupe, LigneMontant, Ligne, Note, Petit, Puce, Puces } from '@/components/ui';
import { SERVICES, service as trouverService, TERRAINS, type ChampFormulaire } from '@/lib/demo';
import { fcfa } from '@/lib/format';
import { couleurs } from '@/lib/theme';

/**
 * Maquettes client 3 et 7 : nouvelle demande. Le formulaire est construit à partir des champs du service.
 * Un séjour peut regrouper plusieurs services (résidence, véhicule, accueil à l'aéroport).
 */
export default function NouvelleDemande() {
  const { service: slug } = useLocalSearchParams<{ service: string }>();
  const principal = trouverService(slug ?? '') ?? SERVICES[0];
  const sejour = principal.categorie === 'sejour';

  const [choisis, setChoisis] = useState<string[]>([principal.slug]);
  const [valeurs, setValeurs] = useState<Record<string, string | string[] | boolean>>({});
  const [formule, setFormule] = useState(principal.formules?.[0]?.libelle);
  const [options, setOptions] = useState<string[]>([]);

  const services = SERVICES.filter((s) => choisis.includes(s.slug));
  const basculerService = (s: string) => setChoisis((c) => (c.includes(s) ? c.filter((x) => x !== s) : [...c, s]));
  const changer = (cle: string, v: string | string[] | boolean) => setValeurs((x) => ({ ...x, [cle]: v }));

  // Estimation : seulement pour un service à prix fixe seul (sinon : proposition ou devis de l'agent)
  const fixeSeul = services.length === 1 && principal.mode === 'fixe';
  const prixFormule = principal.formules?.find((f) => f.libelle === formule)?.prix ?? principal.des ?? 0;
  const prixOptions = (principal.options ?? []).filter((o) => options.includes(o.libelle) && o.montant).reduce((t, o) => t + (o.montant ?? 0), 0);
  const officiels = (principal.fraisOfficiels ?? []).reduce((t, f) => t + f.montant, 0);
  const total = prixFormule + prixOptions + officiels + (principal.fraisGsf ?? 0);
  const surDevis = options.includes('Destination hors Abidjan');

  const envoyer = () => {
    if (fixeSeul && !surDevis) router.replace(`/client/paiement/nouvelle?service=${principal.slug}&montant=${total}`);
    else router.replace('/client/demande-envoyee');
  };

  return (
    <Ecran
      titre={sejour ? 'Nouvelle demande' : principal.nom}
      sousTitre={sejour ? 'Séjour et mobilité' : undefined}
      retour
      piedDePage={
        <>
          {fixeSeul && !surDevis && <LigneMontant libelle="Total à payer" montant={fcfa(total)} fort />}
          <Bouton titre={fixeSeul && !surDevis ? 'Continuer vers le paiement' : 'Envoyer ma demande'} onPress={envoyer} />
        </>
      }
    >
      {sejour && (
        <Groupe libelle="Services">
          {SERVICES.filter((s) => s.categorie === 'sejour').map((s) => (
            <CaseACocher key={s.slug} libelle={s.nom} coche={choisis.includes(s.slug)} onPress={() => basculerService(s.slug)} />
          ))}
        </Groupe>
      )}

      {services.map((s) => (
        <View key={s.slug} style={{ gap: 12 }}>
          {services.length > 1 && <Text style={st.titreService}>{s.nom}</Text>}
          {s.champs.map((c) => (
            <ChampService key={`${s.slug}.${c.cle}`} champ={c} valeur={valeurs[`${s.slug}.${c.cle}`]} onChange={(v) => changer(`${s.slug}.${c.cle}`, v)} />
          ))}
          {s.slug === principal.slug && s.formules && (
            <Groupe libelle={s.categorie === 'foncier' ? 'Zone' : 'Formule'}>
              {s.formules.map((f) => (
                <ChoixLigne key={f.libelle} libelle={`${f.libelle}${f.capacite ? ` · ${f.capacite}` : ''} — ${fcfa(f.prix)}`} actif={formule === f.libelle} onPress={() => setFormule(f.libelle)} />
              ))}
            </Groupe>
          )}
          {s.slug === principal.slug && s.options && (
            <Groupe libelle="Options">
              {s.options.map((o) => (
                <CaseACocher
                  key={o.libelle}
                  libelle={`${o.libelle} (${o.montant === null ? 'sur devis' : `+ ${fcfa(o.montant)}`})`}
                  coche={options.includes(o.libelle)}
                  onPress={() => setOptions((x) => (x.includes(o.libelle) ? x.filter((y) => y !== o.libelle) : [...x, o.libelle]))}
                />
              ))}
            </Groupe>
          )}
        </View>
      ))}

      {principal.categorie === 'demarches' && (
        <Groupe libelle="Procuration">
          <Carte>
            <Ligne>
              <Text style={st.texte}>Procuration GSF</Text>
              <Badge texte={valeurs.procuration ? 'Signée' : 'À signer'} ton={valeurs.procuration ? 'marque' : 'accent'} />
            </Ligne>
            <Petit>Elle autorise GSF à faire la démarche en votre nom. Vous la signez à l'écran.</Petit>
            {!valeurs.procuration && <Bouton titre="Signer la procuration" petit variante="secondaire" onPress={() => changer('procuration', true)} />}
          </Carte>
        </Groupe>
      )}

      {fixeSeul && (
        <Carte>
          <LigneMontant libelle={formule ? `${principal.nom} · ${formule}` : principal.nom} montant={fcfa(prixFormule)} />
          {prixOptions > 0 && <LigneMontant libelle="Options" montant={fcfa(prixOptions)} />}
          {officiels > 0 && <LigneMontant libelle="Frais officiels" montant={fcfa(officiels)} />}
          <LigneMontant libelle="Frais de service GSF" montant={fcfa(principal.fraisGsf ?? 0)} />
          <LigneMontant libelle="Total" montant={fcfa(total)} total fort />
        </Carte>
      )}
      {surDevis && <Note texte="Destination hors Abidjan : votre agent vous enverra un devis." />}
      {!fixeSeul && (
        <Note
          ton="marque"
          texte={
            services.some((s) => s.mode === 'des' || s.mode === 'devis')
              ? 'GSF cherche pour vous et vous envoie des propositions avec le prix exact. Vous ne payez rien maintenant.'
              : 'Votre agent confirme la demande, puis vous réglez l’acompte.'
          }
        />
      )}
    </Ecran>
  );
}

function ChampService({ champ, valeur, onChange }: { champ: ChampFormulaire; valeur: string | string[] | boolean | undefined; onChange: (v: string | string[] | boolean) => void }) {
  const libelle = `${champ.libelle}${champ.requis ? '' : ' (facultatif)'}`;
  switch (champ.type) {
    case 'choix':
      return (
        <Groupe libelle={libelle}>
          {champ.options?.map((o) => (
            <ChoixLigne key={o} libelle={o} actif={valeur === o} onPress={() => onChange(o)} />
          ))}
        </Groupe>
      );
    case 'choixMultiple': {
      const liste = Array.isArray(valeur) ? valeur : [];
      return (
        <Groupe libelle={libelle}>
          <Puces>
            {champ.options?.map((o) => (
              <Puce key={o} libelle={o} actif={liste.includes(o)} onPress={() => onChange(liste.includes(o) ? liste.filter((x) => x !== o) : [...liste, o])} />
            ))}
          </Puces>
        </Groupe>
      );
    }
    case 'fichier':
      return (
        <Groupe libelle={libelle}>
          <Carte>
            <Ligne>
              <Text style={st.texte}>{valeur ? 'Document ajouté' : 'Aucun document'}</Text>
              {valeur ? <Badge texte="Ajouté" /> : <Bouton titre="Ajouter" petit variante="secondaire" icone="camera-outline" onPress={() => onChange(true)} />}
            </Ligne>
          </Carte>
        </Groupe>
      );
    case 'terrain':
      return (
        <Groupe libelle={libelle}>
          {TERRAINS.map((t) => (
            <ChoixLigne key={t.id} libelle={`${t.libelle} · ${t.lieu}`} actif={valeur === t.id} onPress={() => onChange(t.id)} />
          ))}
          <Bouton titre="Ajouter un terrain" petit variante="discret" icone="add" onPress={() => router.push('/client/biens')} />
        </Groupe>
      );
    default:
      return (
        <Champ
          libelle={libelle}
          placeholder={champ.exemple}
          keyboardType={champ.type === 'nombre' ? 'number-pad' : 'default'}
          multiline={champ.cle === 'besoin'}
          value={typeof valeur === 'string' ? valeur : ''}
          onChangeText={onChange}
        />
      );
  }
}

const st = StyleSheet.create({
  titreService: { fontSize: 17, fontWeight: '700', color: couleurs.marque, marginTop: 4 },
  texte: { fontSize: 15, color: couleurs.texte, flex: 1 },
});
