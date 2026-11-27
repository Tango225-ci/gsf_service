import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CONVERSATIONS, conversation as trouverConversation } from '@/lib/demo';
import { couleurs, rayons } from '@/lib/theme';
import { Avatar, Carte, Ecran, Petit, Vignettes } from './ui';

/** Liste des fils de discussion, un par demande. `base` : préfixe des routes du rôle (/client, /agent…). */
export function ListeConversations({ base }: { base: string }) {
  return (
    <Ecran titre="Messages">
      {CONVERSATIONS.map((c) => (
        <Carte key={c.id} onPress={() => router.push(`${base}/conversation/${c.id}` as never)}>
          <View style={s.ligneConv}>
            <Avatar nom={c.avec} />
            <View style={{ flex: 1, gap: 2 }}>
              <View style={s.rangee}>
                <Text style={s.nom}>{c.avec}</Text>
                <Text style={s.heure}>{c.heure}</Text>
              </View>
              <Text style={s.sujet}>{c.titre}</Text>
              <Text style={s.apercu} numberOfLines={1}>{c.dernier}</Text>
            </View>
            {c.nonLus > 0 && (
              <View style={s.pastille}>
                <Text style={s.pastilleTexte}>{c.nonLus}</Text>
              </View>
            )}
          </View>
        </Carte>
      ))}
      <Petit style={{ textAlign: 'center' }}>Un fil par demande, avec photos et notes vocales.</Petit>
    </Ecran>
  );
}

/** Maquette client 10 : un fil de discussion. Les messages envoyés restent locaux (démo). */
export function EcranConversation({ id }: { id: string }) {
  const c = trouverConversation(id) ?? CONVERSATIONS[0];
  const [messages, setMessages] = useState(c.messages);
  const [texte, setTexte] = useState('');

  const envoyer = () => {
    if (!texte.trim()) return;
    setMessages((m) => [...m, { de: 'moi', texte: texte.trim(), heure: 'maintenant' }]);
    setTexte('');
  };

  return (
    <SafeAreaView style={s.ecran} edges={['top', 'bottom']}>
      <View style={s.entete}>
        <Pressable accessibilityRole="button" accessibilityLabel="Retour" hitSlop={10} onPress={() => router.back()} style={s.retour}>
          <Ionicons name="chevron-back" size={24} color={couleurs.texte} />
        </Pressable>
        <Avatar nom={c.avec} taille={34} />
        <View style={{ flex: 1 }}>
          <Text style={s.nom}>{c.avec}</Text>
          <Text style={s.heure}>{c.titre}</Text>
        </View>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.fil}>
          {messages.map((m, i) =>
            m.photos ? (
              <View key={i} style={m.de === 'moi' ? s.aDroite : undefined}>
                <Vignettes nombre={m.photos} />
              </View>
            ) : (
              <View key={i} style={[s.bulle, m.de === 'moi' ? s.bulleMoi : s.bulleAutre]}>
                <Text style={[s.bulleTexte, m.de === 'moi' && { color: couleurs.surMarque }]}>{m.texte}</Text>
                <Text style={[s.bulleHeure, m.de === 'moi' && { color: couleurs.marqueClair }]}>{m.heure}</Text>
              </View>
            ),
          )}
        </ScrollView>
        <View style={s.saisie}>
          <Pressable accessibilityRole="button" accessibilityLabel="Joindre une photo" style={s.iconeSaisie}>
            <Ionicons name="camera-outline" size={22} color={couleurs.discret} />
          </Pressable>
          <TextInput value={texte} onChangeText={setTexte} placeholder="Écrire un message…" placeholderTextColor={couleurs.gris} style={s.champ} multiline />
          <Pressable accessibilityRole="button" accessibilityLabel={texte ? 'Envoyer' : 'Note vocale'} onPress={envoyer} style={s.envoyer}>
            <Ionicons name={texte ? 'send' : 'mic-outline'} size={20} color={couleurs.surMarque} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: couleurs.ecran },
  entete: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: couleurs.bordure, backgroundColor: couleurs.carte },
  retour: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  ligneConv: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rangee: { flexDirection: 'row', justifyContent: 'space-between' },
  nom: { fontSize: 16, fontWeight: '600', color: couleurs.texte },
  heure: { fontSize: 12, color: couleurs.discret },
  sujet: { fontSize: 13, color: couleurs.marque, fontWeight: '500' },
  apercu: { fontSize: 14, color: couleurs.discret },
  pastille: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: couleurs.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  pastilleTexte: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  fil: { padding: 16, gap: 10, flexGrow: 1, justifyContent: 'flex-end' },
  aDroite: { alignSelf: 'flex-end' },
  bulle: { maxWidth: '82%', borderRadius: rayons.grand, paddingHorizontal: 14, paddingVertical: 10, gap: 4 },
  bulleAutre: { alignSelf: 'flex-start', backgroundColor: couleurs.carte, borderWidth: 1, borderColor: couleurs.bordure, borderBottomLeftRadius: 6 },
  bulleMoi: { alignSelf: 'flex-end', backgroundColor: couleurs.marque, borderBottomRightRadius: 6 },
  bulleTexte: { fontSize: 15, color: couleurs.texte, lineHeight: 21 },
  bulleHeure: { fontSize: 11, color: couleurs.discret, alignSelf: 'flex-end' },
  saisie: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, borderTopWidth: 1, borderTopColor: couleurs.bordure, backgroundColor: couleurs.carte },
  iconeSaisie: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  champ: { flex: 1, minHeight: 44, maxHeight: 120, borderRadius: 22, borderWidth: 1, borderColor: couleurs.bordure, paddingHorizontal: 16, paddingTop: 11, fontSize: 15, color: couleurs.texte },
  envoyer: { width: 44, height: 44, borderRadius: 22, backgroundColor: couleurs.marque, alignItems: 'center', justifyContent: 'center' },
});
