import { StyleSheet, Text, View } from 'react-native';
import type { Etape } from '@/lib/demo';
import { couleurs } from '@/lib/theme';
import { Vignettes } from './ui';

/** Fil de suivi d'une demande : étapes datées, avec photos comme preuves. */
export function FilSuivi({ etapes }: { etapes: Etape[] }) {
  return (
    <View style={s.fil}>
      {etapes.map((e, i) => (
        <View key={`${e.titre}-${i}`} style={s.etape}>
          <View style={s.colonne}>
            <View style={[s.point, e.etat === 'fait' && s.pointFait, e.etat === 'encours' && s.pointEnCours]} />
            {i < etapes.length - 1 && <View style={[s.trait, e.etat === 'fait' && s.traitFait]} />}
          </View>
          <View style={s.contenu}>
            <Text style={[s.titre, e.etat === 'avenir' && s.titreAVenir, e.etat === 'encours' && s.titreEnCours]}>{e.titre}</Text>
            {e.date && <Text style={s.date}>{e.date}</Text>}
            {e.detail && <Text style={s.detail}>{e.detail}</Text>}
            {e.photos ? <Vignettes nombre={e.photos} /> : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  fil: { gap: 0 },
  etape: { flexDirection: 'row', gap: 12 },
  colonne: { alignItems: 'center', width: 16 },
  point: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: couleurs.bordure, backgroundColor: couleurs.carte, marginTop: 3 },
  pointFait: { backgroundColor: couleurs.marque, borderColor: couleurs.marque },
  pointEnCours: { backgroundColor: couleurs.accent, borderColor: couleurs.accent },
  trait: { flex: 1, width: 2, backgroundColor: couleurs.bordure, marginVertical: 2 },
  traitFait: { backgroundColor: couleurs.marque },
  contenu: { flex: 1, paddingBottom: 18, gap: 4 },
  titre: { fontSize: 15, fontWeight: '600', color: couleurs.texte },
  titreAVenir: { color: couleurs.gris, fontWeight: '400' },
  titreEnCours: { color: couleurs.accent },
  date: { fontSize: 12, color: couleurs.discret },
  detail: { fontSize: 13, color: couleurs.discret, lineHeight: 18 },
});
