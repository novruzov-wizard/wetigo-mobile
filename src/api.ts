/**
 * Wetigo mobile API client — talks to the SAME backend as the web app.
 * Uses AsyncStorage for the bearer/refresh tokens (no localStorage in RN).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE = 'https://wetigo-backend.onrender.com';

let TOKEN: string | null = null;
let REFRESH: string | null = null;

export async function loadTokens() {
  try {
    TOKEN = await AsyncStorage.getItem('wetigo:token');
    REFRESH = await AsyncStorage.getItem('wetigo:refresh');
  } catch {}
  return { token: TOKEN, refresh: REFRESH };
}
export function getToken() { return TOKEN; }
async function setTokens(token: string | null, refresh?: string | null) {
  TOKEN = token;
  if (refresh !== undefined) REFRESH = refresh;
  try {
    if (token) await AsyncStorage.setItem('wetigo:token', token); else await AsyncStorage.removeItem('wetigo:token');
    if (refresh !== undefined) {
      if (refresh) await AsyncStorage.setItem('wetigo:refresh', refresh); else await AsyncStorage.removeItem('wetigo:refresh');
    }
  } catch {}
}
export async function clearSession() { await setTokens(null, null); }

let refreshing: Promise<boolean> | null = null;
async function doRefresh(): Promise<boolean> {
  if (!REFRESH) return false;
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await fetch(`${BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: REFRESH }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        if (data?.token) { await setTokens(data.token, data.refreshToken ?? REFRESH); return true; }
        return false;
      } catch { return false; }
      finally { refreshing = null; }
    })();
  }
  return refreshing;
}

async function request<T = any>(path: string, opts: RequestInit = {}, retry = true): Promise<T> {
  const isForm = typeof FormData !== 'undefined' && opts.body instanceof FormData;
  const headers: Record<string, string> = { ...(opts.headers as any) };
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  if ((res.status === 401 || res.status === 403) && retry && !isForm) {
    if (await doRefresh()) return request<T>(path, opts, false);
    await clearSession();
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

export type Place = {
  id: number; name: string; category?: string; categoryId?: string; city?: string;
  image?: string; rating?: number; reviews?: number; price?: string; lat?: number; lng?: number;
  verified?: boolean; premium?: boolean; open?: boolean; openingHours?: any; country?: string;
};

export const auth = {
  async login(email: string, password: string) {
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (data?.token) await setTokens(data.token, data.refreshToken ?? null);
    return data;
  },
  async register(payload: any) {
    return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  },
  me() { return request('/auth/me'); },
  logout() { return clearSession(); },
};

export const places = {
  list(): Promise<Place[]> { return request('/places'); },
  get(id: number): Promise<Place> { return request(`/places/${id}`); },
  reviews(id: number) { return request(`/places/${id}/reviews`); },
};

export const favorites = {
  list(): Promise<number[]> { return request('/favorites'); },
  add(id: number) { return request(`/favorites/${id}`, { method: 'POST' }); },
  remove(id: number) { return request(`/favorites/${id}`, { method: 'DELETE' }); },
};
