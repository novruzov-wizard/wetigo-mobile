import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { loadTokens, getToken, auth } from './src/api';
import { theme } from './src/theme';
import { IconGrid, IconSearch, IconHeart, IconUser, IconPlus } from './src/icons';
import HomeScreen from './src/screens/HomeScreen';
import ListScreen from './src/screens/ListScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PlaceDetailScreen from './src/screens/PlaceDetailScreen';
import AuthScreen from './src/screens/AuthScreen';

type Tab = 'home' | 'explore' | 'saved' | 'profile';

export default function App() {
  const [booting, setBooting] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>('home');
  const [detailId, setDetailId] = useState<number | null>(null);

  const boot = useCallback(async () => {
    await loadTokens();
    if (getToken()) {
      try { await auth.me(); setAuthed(true); } catch { setAuthed(false); }
    }
    setBooting(false);
  }, []);
  useEffect(() => { boot(); }, [boot]);

  const logout = async () => { await auth.logout(); setAuthed(false); setTab('home'); };

  if (booting) return <View style={s.center}><ActivityIndicator color={theme.blue} size="large" /></View>;
  if (!authed) return (
    <SafeAreaProvider><StatusBar style="dark" /><AuthScreen onAuthed={() => setAuthed(true)} /></SafeAreaProvider>
  );

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        {tab === 'home' && <HomeScreen onOpen={setDetailId} />}
        {tab === 'explore' && <ListScreen title="Explore" onOpen={setDetailId} />}
        {tab === 'saved' && <ListScreen title="Saved" savedOnly onOpen={setDetailId} />}
        {tab === 'profile' && <ProfileScreen onLogout={logout} />}

        {/* Wolt-style floating tab bar with centre + */}
        <SafeAreaView edges={['bottom']} style={s.tabWrap}>
          <View style={s.tabBar}>
            <TabItem label="Home" active={tab === 'home'} onPress={() => setTab('home')} Icon={IconGrid} />
            <TabItem label="Explore" active={tab === 'explore'} onPress={() => setTab('explore')} Icon={IconSearch} />
            <TouchableOpacity style={s.fab} onPress={() => Alert.alert('Wetigo', 'Yer əlavə etmə tezliklə əlavə olunacaq')}>
              <IconPlus size={26} color="#fff" />
            </TouchableOpacity>
            <TabItem label="Saved" active={tab === 'saved'} onPress={() => setTab('saved')} Icon={IconHeart} />
            <TabItem label="You" active={tab === 'profile'} onPress={() => setTab('profile')} Icon={IconUser} />
          </View>
        </SafeAreaView>

        {detailId != null && (
          <View style={StyleSheet.absoluteFill}>
            <PlaceDetailScreen id={detailId} onBack={() => setDetailId(null)} />
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

function TabItem({ label, active, onPress, Icon }: { label: string; active: boolean; onPress: () => void; Icon: any }) {
  const c = active ? theme.blue : '#b9b4c4';
  return (
    <TouchableOpacity style={s.tabItem} onPress={onPress}>
      <Icon size={22} color={c} fill={active && label === 'Saved' ? c : 'none'} />
      <Text style={[s.tabLabel, { color: c }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg },
  tabWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  tabBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#fff', marginHorizontal: 14, marginBottom: 8, borderRadius: 24, height: 64, shadowColor: '#140a28', shadowOpacity: 0.16, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  tabItem: { alignItems: 'center', gap: 4, flex: 1 },
  tabLabel: { fontSize: 10, fontWeight: '700' },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: theme.blue, alignItems: 'center', justifyContent: 'center', marginTop: -26, shadowColor: theme.blue, shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
});
