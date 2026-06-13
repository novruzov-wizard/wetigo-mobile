import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../api';
import { theme } from '../theme';

export default function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  const [me, setMe] = useState<any>(null);
  useEffect(() => { auth.me().then(setMe).catch(() => {}); }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <View style={s.header}>
        <Image source={{ uri: me?.avatar || 'https://i.pravatar.cc/120?img=12' }} style={s.avatar} />
        <Text style={s.name}>{me?.name || 'Wetigo Member'}</Text>
        <Text style={s.email}>{me?.email || ''}</Text>
      </View>
      <View style={s.stats}>
        {[['Reviews', me?.reviews ?? 0], ['Saved', me?.favorites ?? 0], ['Card', me?.card ? '✓' : '—']].map(([l, v]) => (
          <View key={l as string} style={s.stat}><Text style={s.statV}>{String(v)}</Text><Text style={s.statL}>{l}</Text></View>
        ))}
      </View>
      <TouchableOpacity style={s.logout} onPress={onLogout}><Text style={s.logoutTxt}>Çıxış</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: theme.blue, margin: 16, borderRadius: 24, padding: 24, alignItems: 'center' },
  avatar: { width: 84, height: 84, borderRadius: 24, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
  name: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 12 },
  email: { color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  stats: { flexDirection: 'row', gap: 12, marginHorizontal: 16 },
  stat: { flex: 1, backgroundColor: theme.chip, borderRadius: 18, padding: 18, alignItems: 'center' },
  statV: { fontSize: 22, fontWeight: '800', color: theme.ink },
  statL: { color: theme.sub, marginTop: 4, fontSize: 12 },
  logout: { marginTop: 'auto', margin: 16, borderWidth: 1, borderColor: theme.line, borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  logoutTxt: { color: '#e11d48', fontWeight: '700' },
});
