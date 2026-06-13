import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { places as placesApi, favorites as favApi, Place } from '../api';
import { theme } from '../theme';
import { IconSearch, IconStar, IconPin } from '../icons';

// Shared screen used for Explore (all) and Saved (favorites only).
export default function ListScreen({ title, savedOnly, onOpen }: { title: string; savedOnly?: boolean; onOpen: (id: number) => void }) {
  const [data, setData] = useState<Place[]>([]);
  const [favs, setFavs] = useState<number[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await placesApi.list();
        setData(Array.isArray(list) ? list : []);
        if (savedOnly) { try { setFavs(await favApi.list()); } catch {} }
      } catch {}
      setLoading(false);
    })();
  }, [savedOnly]);

  const items = useMemo(() => {
    let r = savedOnly ? data.filter((p) => favs.includes(p.id)) : data;
    if (q.trim()) { const t = q.toLowerCase(); r = r.filter((p) => `${p.name} ${p.category} ${p.city}`.toLowerCase().includes(t)); }
    return r;
  }, [data, favs, q, savedOnly]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <Text style={s.h}>{title}</Text>
      <View style={s.search}><IconSearch size={18} color={theme.sub} /><TextInput style={s.input} placeholder="Search…" placeholderTextColor={theme.sub} value={q} onChangeText={setQ} /></View>
      {loading ? <ActivityIndicator color={theme.blue} style={{ marginTop: 30 }} /> : (
        <FlatList
          data={items}
          keyExtractor={(p) => String(p.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          ListEmptyComponent={<Text style={s.empty}>{savedOnly ? 'Hələ saxlanmış yer yoxdur.' : 'Nəticə yoxdur.'}</Text>}
          renderItem={({ item: p }) => (
            <TouchableOpacity style={s.row} activeOpacity={0.9} onPress={() => onOpen(p.id)}>
              <Image source={{ uri: p.image || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80' }} style={s.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={s.name} numberOfLines={1}>{p.name}</Text>
                <Text style={s.sub} numberOfLines={1}>{[p.category, p.city].filter(Boolean).join(' · ')}</Text>
                <View style={s.meta}>
                  {(p.rating ?? 0) > 0 ? <View style={s.mi}><IconStar size={12} /><Text style={s.mt}>{p.rating}</Text></View> : <Text style={[s.mt, { color: theme.blue, fontWeight: '700' }]}>New</Text>}
                  {p.city ? <View style={s.mi}><IconPin size={12} color={theme.sub} /><Text style={s.mt}>{p.city}</Text></View> : null}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  h: { fontSize: 26, fontWeight: '800', color: theme.ink, paddingHorizontal: 16, paddingTop: 6 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme.chip, marginHorizontal: 16, marginTop: 12, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12 },
  input: { flex: 1, fontSize: 15, color: theme.ink, padding: 0 },
  empty: { textAlign: 'center', color: theme.sub, marginTop: 40 },
  row: { flexDirection: 'row', gap: 12, backgroundColor: '#fff', borderRadius: 16, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: theme.line },
  thumb: { width: 76, height: 76, borderRadius: 12 },
  name: { fontSize: 16, fontWeight: '700', color: theme.ink },
  sub: { fontSize: 13, color: theme.sub, marginTop: 3 },
  meta: { flexDirection: 'row', gap: 14, marginTop: 8 },
  mi: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mt: { fontSize: 13, color: theme.sub, fontWeight: '600' },
});
