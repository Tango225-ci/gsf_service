import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Bouton, Carte, Ecran, LigneMontant, Petit, Puces, Vignette } from '@/components/ui';
import { prixAffiche, service as trouverService } from '@/lib/demo';
import { fcfa } from '@/lib/format';
import { couleurs } from '@/lib/theme';

const MODES = { fixe: 'Prix fixe', unite: "Prix à l'unité", des: 'À partir de', devis: 'Sur devis' };

/** Maquette client 2 : fiche d'un service avec ses tarifs, ses options et ce qui est inclus. */
export default function FicheService() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const service = trouverService(slug);
  if (!service) return <Ecran titre="Service introuvable" retour><Petit>Ce service n'existe pas.</Petit></Ecran>;

  const appel = service.mode === 'devis' ? 'Demander un devis' : service.mode === 'des' ? 'Faire ma demande' : `Commander · ${prixAffiche(service)}`;

  return (
    <Ecran
      titre={service.nom}
      retour
      piedDePage={<Bouton titre={appel} onPress={() => router.push(`/client/nouvelle-demande?service=${service.slug}`)} />}
    >
      <Vignette hauteur={120} />
      <View style={s.rangee}>
        <Badge texte={MODES[service.mode]} ton={service.mode === 'devis' ? 'accent' : 'marque'} />
        <Text style={s.prix}>{prixAffiche(service)}</Text>
      </View>
      <Text style={s.description}>{service.description}</Text>

      {service.formules && (
        <Carte>
          <Text style={s.titre}>Tarifs{service.slug === 'accueil-aeroport' ? ' · aéroport → Abidjan' : ' selon la zone'}</Text>
          {service.formules.map((f) => (
            <LigneMontant key={f.libelle} libelle={f.capacite ? `${f.libelle} · ${f.capacite}` : f.libelle} montant={fcfa(f.prix)} fort />
          ))}
        </Carte>
      )}

      {service.options && (
        <Carte>
          <Text style={s.titre}>Options</Text>
          {service.options.map((o) => (
            <LigneMontant key={o.libelle} libelle={o.libelle} montant={o.montant === null ? 'Sur devis' : `+ ${fcfa(o.montant)}`} />
          ))}
        </Carte>
      )}

      {service.fraisOfficiels && (
        <Carte>
          <Text style={s.titre}>Frais officiels, payés à l'administration</Text>
          {service.fraisOfficiels.map((f) => (
            <LigneMontant key={f.libelle} libelle={f.libelle} montant={fcfa(f.montant)} />
          ))}
        </Carte>
      )}

      {service.inclus && (
        <Puces>
          {service.inclus.map((i) => (
            <Badge key={i} texte={i} />
          ))}
        </Puces>
      )}

      <Petit>
        {service.fraisGsf
          ? `Frais de service GSF : ${fcfa(service.fraisGsf)}, affichés à part.`
          : service.mode === 'devis'
            ? "Votre agent vous envoie un devis détaillé, frais de service GSF compris."
            : 'Le prix exact et les frais de service GSF figurent dans la proposition de votre agent.'}
      </Petit>
      <Petit>
        {service.mode === 'fixe' ? 'Payé en totalité à la commande.' : 'Acompte à la commande, solde à la livraison.'}
      </Petit>
    </Ecran>
  );
}

const s = StyleSheet.create({
  rangee: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prix: { fontSize: 18, fontWeight: '700', color: couleurs.marque },
  description: { fontSize: 15, color: couleurs.texte, lineHeight: 22 },
  titre: { fontSize: 15, fontWeight: '600', color: couleurs.texte, marginBottom: 2 },
});
