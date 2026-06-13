import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { auth } from '../api';
import { theme } from '../theme';

export default function AuthScreen({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email || !password) { Alert.alert('Wetigo', 'Email və şifrə daxil edin'); return; }
    setBusy(true);
    try {
      if (mode === 'register') {
        await auth.register({ name, email, password });
      }
      await auth.login(email, password);
      onAuthed();
    } catch (e: any) {
      Alert.alert('Wetigo', mode === 'login' ? 'Giriş alınmadı' : 'Qeydiyyat alınmadı');
    } finally { setBusy(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.wrap}>
      <Text style={s.logo}>Wetigo</Text>
      <Text style={s.tagline}>Kəşf et · rəy ver · yol göstər</Text>
      <View style={s.card}>
        {mode === 'register' && (
          <TextInput style={s.input} placeholder="Ad" placeholderTextColor={theme.sub} value={name} onChangeText={setName} />
        )}
        <TextInput style={s.input} placeholder="Email" placeholderTextColor={theme.sub} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <TextInput style={s.input} placeholder="Şifrə" placeholderTextColor={theme.sub} secureTextEntry value={password} onChangeText={setPassword} />
        <TouchableOpacity style={s.btn} onPress={submit} disabled={busy}>
          {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.btnTxt}>{mode === 'login' ? 'Daxil ol' : 'Qeydiyyat'}</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
          <Text style={s.switch}>{mode === 'login' ? 'Hesabın yoxdur? Qeydiyyat' : 'Hesabın var? Daxil ol'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.bg, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 40, fontWeight: '800', color: theme.blue, textAlign: 'center' },
  tagline: { textAlign: 'center', color: theme.sub, marginTop: 6, marginBottom: 28 },
  card: { gap: 12 },
  input: { backgroundColor: theme.chip, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: theme.ink },
  btn: { backgroundColor: theme.blue, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
  btnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  switch: { color: theme.link, textAlign: 'center', marginTop: 14, fontWeight: '600' },
});
