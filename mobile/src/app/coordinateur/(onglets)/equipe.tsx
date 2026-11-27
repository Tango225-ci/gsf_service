import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Badge, Carte, Ecran, Petit } from '@/components/ui';
import { CATEGORIES, EQUIPE } from '@/lib/demo';
import { couleurs } from '@/lib/theme';

/** L'équipe : agents et géomètres du cabinet, leur charge et leur zone. */
export default function Equipe() {
  const trie = [...EQUIPE].sort((a, b) => Number(b.disponible) - Number(a.disponible) || a.dossiers - b.dossiers);

  return (
    <Ecran titre="Équipe" sousTitre={`${EQUIPE.filter((e) => e.disponible).length} agents disponibles`}>
      {trie.map((e) => (
        <Carte key={e.id} style={!e.disponible && { opacity: 0.6 }}>
          <View style={s.ligne}>
            <Avatar nom={e.nom} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={s.nom}>{e.nom}</Text>
              <Petit>{e.poste}</Petit>
            </View>
            {e.disponible ? <Badge texte={`${e.dossiers} dossiers`} ton={e.dossiers >= 7 ? 'accent' : 'marque'} /> : <Badge texte="Absent" ton="neutre" />}
          </View>
          <Petit>
            {e.competences.map((c) => CATEGORIES[c].nom).join(', ')} · {e.zone}
          </Petit>
        </Carte>
      ))}
      <Petit style={{ textAlign: 'center' }}>Pour réaffecter une demande en cours, ouvrez-la depuis le back-office ou les messages.</Petit>
    </Ecran>
  );
}

const s = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nom: { fontSize: 15, fontWeight: '600', color: couleurs.texte },
});
