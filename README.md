# Wetigo Mobile (iOS + Android)

Expo (React Native + TypeScript). Tək kod bazası → həm **iOS**, həm **Android**, həm web.
Sənin mövcud backend-inə (`https://wetigo-backend.onrender.com`) birbaşa bağlanır — eyni hesablar, eyni məkanlar, eyni rəylər.

## İşə salmaq

```bash
cd ~/Downloads/wetigo-mobile
npm start
```

- Terminalda **QR kod** çıxacaq.
- Telefonuna **Expo Go** tətbiqini quraşdır (App Store / Google Play).
- iPhone: **Kamera** ilə QR-ı oxut. Android: **Expo Go** içindən QR-ı oxut.
- App telefonunda açılır — dəyişiklik etdikcə dərhal yenilənir (hot reload).

Simulyator: `npm run ios` (Xcode lazım) və ya `npm run android` (Android Studio lazım).

## Strukturu

- `src/api.ts` — backend API klienti (AsyncStorage token-lər, login/refresh).
- `src/theme.ts` — dizayn tokenləri (Wolt mavi #029DE2; bənövşəyi də mövcud).
- `src/icons.tsx` — SVG ikonlar.
- `src/screens/` — Auth, Home (Discovery), List (Explore/Saved), PlaceDetail, Profile.
- `App.tsx` — auth gate + Wolt-üslublu bottom tab bar (mərkəzi +).

## Mağazaya çıxarmaq (sonra)

```bash
npm i -g eas-cli
eas build -p ios      # App Store üçün
eas build -p android  # Google Play üçün
```

(EAS Apple/Google developer hesabı tələb edir.)
