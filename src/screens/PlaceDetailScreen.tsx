import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { places as placesApi, Place } from '../api';
import { theme } from '../theme';
import { IconBack, IconShare, IconHeart, IconStar, IconCheck, IconClock, IconNav } from '../icons';

export default function PlaceDetailScreen({ id, onBack }: { id: number; onBack: () => void }) {
  const [p, setP] = useState<Place | null>(null);
  useEffect(() => { placesApi.get(id).then(setP).catch(() => {}); }, [id]);

  if (!p) return <View style={s.center}><ActivityIndicator color={theme.blue} /></View>;

  const directions = () => { if (p.lat && p.lng) Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`); };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View>
          <Image source={{ uri: p.image || 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=680&q=80' }} style={s.hero} />
          <TouchableOpacity style={[s.circle, { left: 16 }]} onPress={onBack}><IconBack size={18} /></TouchableOpacity>
          <View style={[s.circleRow]}>
            <View style={s.circle2}><IconShare size={15} /></View>
            <View style={s.circle2}><IconHeart size={16} /></View>
          </View>
        </View>
        <View style={s.body}>
          <Text style={s.name}>{p.name}</Text>
          <View style={s.metaRow}>
            {p.verified ? <View style={s.vrow}><IconCheck size={14} color={theme.green} /><Text style={s.vtxt}>Verified</Text></View> : null}
            <Text style={s.sub}>{[p.category, p.price].filter(Boolean).join(' · ')}</Text>
          </View>
          <View style={s.chipsRow}>
            {(p.rating ?? 0) > 0 ? (
              <View style={s.statChip}><IconStar size={12} /><Text style={s.statTxt}>{p.rating} · {p.reviews ?? 0}</Text></View>
            ) : <View style={s.statChip}><Text style={[s.statTxt, { color: theme.blue }]}>New</Text></View>}
            <View style={[s.statChip, { backgroundColor: '#e7f6ec' }]}><IconClock size={11} color={theme.green} /><Text style={[s.statTxt, { color: theme.green }]}>{p.open ? 'Open' : 'Closed'}{p.city ? ` · ${p.city}` : ''}</Text></View>
          </View>
          <View style={s.actions}>
            <TouchableOpacity style={[s.action, { backgroundColor: theme.blue }]} onPress={directions}>
              <IconNav size={18} color="#fff" /><Text style={[s.actionTxt, { color: '#fff' }]}>Directions</Text>
            </TouchableOpacity>
            <View style={[s.action, { backgroundColor: theme.chip }]}><IconHeart size={18} color={theme.ink} /><Text style={s.actionTxt}>Save</Text></View>
            <View style={[s.action, { backgroundColor: theme.chip }]}><IconShare size={18} color={theme.ink} /><Text style={s.actionTxt}>Share</Text></View>
          </View>
        </View>
      </ScrollView>
      <View style={s.bottomBar}>
        <TouchableOpacity style={s.reviewBtn}><Text style={s.reviewTxt}>Write a review</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg },
  hero: { width: '100%', height: 280 },
  circle: { position: 'absolute', top: 52, width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  circleRow: { position: 'absolute', top: 52, right: 16, flexDirection: 'row', gap: 10 },
  circle2: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20 },
  name: { fontSize: 26, fontWeight: '800', color: theme.ink },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  vrow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vtxt: { color: theme.green, fontWeight: '700', fontSize: 13 },
  sub: { color: theme.sub, fontSize: 13 },
  chipsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.chip, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 6 },
  statTxt: { fontSize: 12, fontWeight: '700', color: theme.ink },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  action: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 16, gap: 5 },
  actionTxt: { fontSize: 12, fontWeight: '700', color: theme.ink },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: theme.line },
  reviewBtn: { backgroundColor: theme.blue, borderRadius: 16, height: 52, alignItems: 'center', justifyContent: 'center' },
  reviewTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
