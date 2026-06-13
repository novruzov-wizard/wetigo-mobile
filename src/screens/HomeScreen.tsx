import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { places as placesApi, Place } from '../api';
import { theme } from '../theme';
import { IconBell, IconPin, IconChevron, IconSearch, IconStar, IconHeart, IconCheck } from '../icons';

const CATS = [
  { name: 'Dining', img: 'photo-1517248135467-4c7edcad34c4' },
  { name: 'Cafes', img: 'photo-1559925393-8be0ec4767c8' },
  { name: 'Bars', img: 'photo-1514362545857-3bc16c4c7d1b' },
  { name: 'Fitness', img: 'photo-1534438327276-14e5300c3a48' },
  { name: 'Beauty', img: 'photo-1600334129128-685c5582fd35' },
];
const un = (id: string, w = 400) => `https://images.unsplash.com/${id}?w=${w}&q=80&fit=crop`;

export default function HomeScreen({ onOpen }: { onOpen: (id: number) => void }) {
  const [data, setData] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try { const list = await placesApi.list(); setData(Array.isArray(list) ? list : []); } catch {}
    setLoading(false); setRefreshing(false);
  };
  useEffect(() => { load(); }, []);

  const popular = [...data].sort((a, b) => (Number(b.premium) - Number(a.premium)) || ((b.rating ?? 0) - (a.rating ?? 0))).slice(0, 12);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}>
        {/* top bar */}
        <View style={s.top}>
          <View>
            <Text style={s.eyebrow}>EXPLORE IN</Text>
            <View style={s.locRow}><IconPin size={15} /><Text style={s.loc}>Baku, Azerbaijan</Text><IconChevron size={15} /></View>
          </View>
          <View style={s.bell}><IconBell size={20} /><View style={s.dot} /></View>
        </View>

        {/* search */}
        <View style={s.search}><IconSearch size={19} color={theme.sub} /><Text style={s.searchTxt}>Search places, cuisines…</Text></View>

        {/* categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catRow}>
          {CATS.map((c) => (
            <View key={c.name} style={s.chip}>
              <Image source={{ uri: un(c.img, 80) }} style={s.chipImg} />
              <Text style={s.chipTxt}>{c.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* promo */}
        <View style={s.promo}>
          <Image source={{ uri: un('photo-1466978913421-dad2ebd01d17', 600) }} style={s.promoImg} />
          <View style={s.promoOverlay}>
            <View style={s.promoTopRow}>
              <Text style={s.promoPct}>20% OFF</Text>
              <View style={s.wplus}><Text style={s.wplusTxt}>W+</Text></View>
            </View>
            <Text style={s.promoSub}>Perks at top-rated places near you</Text>
          </View>
        </View>

        {/* popular */}
        <View style={s.sectionHead}><Text style={s.sectionTitle}>Popular near you</Text><Text style={s.seeAll}>See all</Text></View>
        {loading ? <ActivityIndicator color={theme.blue} style={{ marginTop: 30 }} /> :
          popular.map((p) => (
            <TouchableOpacity key={p.id} style={s.card} activeOpacity={0.9} onPress={() => onOpen(p.id)}>
              <View>
                <Image source={{ uri: p.image || un('photo-1414235077428-338989a2e8c0', 560) }} style={s.cardImg} />
                <View style={[s.badge, { backgroundColor: p.open ? theme.green : theme.ink }]}>
                  <Text style={s.badgeTxt}>{p.open ? 'Open now' : (p.premium ? 'Promoted' : 'Place')}</Text>
                </View>
                <View style={s.fav}><IconHeart size={16} /></View>
              </View>
              <View style={s.cardBody}>
                <View style={s.cardTitleRow}>
                  <Text style={s.cardName} numberOfLines={1}>{p.name}</Text>
                  {p.verified ? <IconCheck size={14} color={theme.green} /> : null}
                </View>
                <Text style={s.cardSub} numberOfLines={1}>{[p.category, p.city].filter(Boolean).join(' · ')}</Text>
                <View style={s.cardMeta}>
                  {(p.rating ?? 0) > 0 ? (
                    <View style={s.metaItem}><IconStar size={12} /><Text style={s.metaTxt}>{p.rating}</Text></View>
                  ) : <Text style={[s.metaTxt, { color: theme.blue, fontWeight: '700' }]}>New</Text>}
                  {p.price ? <Text style={s.metaTxt}>{p.price}</Text> : null}
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 6 },
  eyebrow: { fontSize: 11, color: theme.sub, fontWeight: '700', letterSpacing: 0.5 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  loc: { fontSize: 17, fontWeight: '800', color: theme.ink },
  bell: { width: 44, height: 44, borderRadius: 16, backgroundColor: theme.chip, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 11, right: 12, width: 7, height: 7, borderRadius: 4, backgroundColor: theme.blue },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.chip, marginHorizontal: 20, marginTop: 16, borderRadius: 14, paddingHorizontal: 15, paddingVertical: 14 },
  searchTxt: { color: theme.sub, fontSize: 15 },
  catRow: { paddingHorizontal: 20, paddingVertical: 18, gap: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: theme.chip, borderRadius: 24, paddingHorizontal: 12, paddingVertical: 7, marginRight: 4 },
  chipImg: { width: 20, height: 20, borderRadius: 10 },
  chipTxt: { fontSize: 12, fontWeight: '700', color: theme.ink },
  promo: { marginHorizontal: 20, height: 170, borderRadius: 16, overflow: 'hidden', backgroundColor: theme.blueDark },
  promoImg: { ...StyleSheet.absoluteFillObject, opacity: 0.45, width: '100%', height: '100%' },
  promoOverlay: { flex: 1, padding: 18, justifyContent: 'space-between' },
  promoTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  promoPct: { color: '#fff', fontSize: 26, fontWeight: '800' },
  wplus: { backgroundColor: '#fff', borderRadius: 24, paddingHorizontal: 12, paddingVertical: 4 },
  wplusTxt: { color: theme.blue, fontWeight: '800' },
  promoSub: { color: '#fff', fontWeight: '700', fontSize: 13 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: theme.ink },
  seeAll: { color: theme.link, fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 18, marginHorizontal: 20, marginBottom: 16, shadowColor: '#1e0f3c', shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 3, overflow: 'hidden', borderWidth: 1, borderColor: theme.line },
  cardImg: { width: '100%', height: 150 },
  badge: { position: 'absolute', top: 11, left: 11, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
  badgeTxt: { color: '#fff', fontSize: 10, fontWeight: '700' },
  fav: { position: 'absolute', top: 11, right: 11, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 13 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardName: { fontSize: 16, fontWeight: '700', color: theme.ink, flexShrink: 1 },
  cardSub: { fontSize: 13, color: theme.sub, marginTop: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaTxt: { fontSize: 13, color: theme.sub, fontWeight: '600' },
});
