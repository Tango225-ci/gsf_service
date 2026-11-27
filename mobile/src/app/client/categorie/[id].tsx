import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Carte, Ecran, Petit } from '@/components/ui';
import { CATEGORIES, prixAffiche, SERVICES, type Categorie } from '@/lib/demo';
import { couleurs } from '@/lib/theme';

/** Maquette client 8 (catégorie Foncier), valable pour chaque catégorie : ses services et leur prix. */
export default function CategorieServices() {
  const { id } = useLocalSearchParams<{ id: Categorie }>();
  const categorie = CATEGORIES[id] ?? CATEGORIES.autre;
  const services = SERVICES.filter((s) => s.categorie === id);

  return (
    <Ecran titre={categorie.nom} retour>
      {id === 'foncier' && <Petit>Pour votre terrain en Côte d'Ivoire, même à distance. Tout est géré par le cabinet de géomètres de GSF.</Petit>}
      {services.map((service) => (
        <Carte key={service.slug} onPress={() => router.push(`/client/service/${service.slug}`)}>
          <View style={s.rangee}>
            <Text style={s.nom}>{service.nom}</Text>
            <Text style={s.prix}>{prixAffiche(service)}</Text>
          </View>
          <Petit>{service.description}</Petit>
        </Carte>
      ))}
      {id === 'foncier' && (
        <Carte onPress={() => router.push('/client/biens')}>
          <Text style={s.nom}>Mes biens</Text>
          <Petit>Enregistrez vos terrains une fois : chaque demande foncière s'y rattache.</Petit>
        </Carte>
      )}
    </Ecran>
  );
}

const s = StyleSheet.create({
  rangee: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  nom: { fontSize: 16, fontWeight: '600', color: couleurs.texte, flex: 1 },
  prix: { fontSize: 14, fontWeight: '600', color: couleurs.marque },
});
