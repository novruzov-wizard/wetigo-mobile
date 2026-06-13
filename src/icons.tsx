import React from 'react';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';

type P = { size?: number; color?: string; fill?: string; w?: number };
const S = ({ size = 22, color = '#222126', fill = 'none', w = 1.8, children }: P & { children: React.ReactNode }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{children}</Svg>
);

export const IconGrid = (p: P) => <S {...p}><Rect x="3" y="3" width="7" height="7" rx="1" /><Rect x="14" y="3" width="7" height="7" rx="1" /><Rect x="3" y="14" width="7" height="7" rx="1" /><Rect x="14" y="14" width="7" height="7" rx="1" /></S>;
export const IconSearch = (p: P) => <S {...p}><Circle cx="11" cy="11" r="7" /><Path d="m20 20-3.2-3.2" /></S>;
export const IconHeart = (p: P) => <S {...p}><Path d="M20.8 6.6a5 5 0 0 0-7.1 0L12 8.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-7.3a5 5 0 0 0 0-7.1Z" /></S>;
export const IconUser = (p: P) => <S {...p}><Circle cx="12" cy="8" r="4" /><Path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></S>;
export const IconPlus = (p: P) => <S {...p}><Path d="M12 5v14M5 12h14" /></S>;
export const IconStar = (p: P) => <S {...p} fill={p.color ?? '#F59E0B'}><Polygon points="12,2.5 14.9,8.6 21.5,9.5 16.7,14.1 17.9,20.7 12,18.6 6.1,21.3 7.3,14.7 2.5,9.5 9.1,8.6" /></S>;
export const IconPin = (p: P) => <S {...p}><Path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><Circle cx="12" cy="10" r="2.5" /></S>;
export const IconChevron = (p: P) => <S {...p}><Path d="M6 9l6 6 6-6" /></S>;
export const IconBack = (p: P) => <S {...p}><Path d="M15 18l-6-6 6-6" /></S>;
export const IconShare = (p: P) => <S {...p}><Circle cx="18" cy="5" r="3" /><Circle cx="6" cy="12" r="3" /><Circle cx="18" cy="19" r="3" /><Path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></S>;
export const IconClock = (p: P) => <S {...p}><Circle cx="12" cy="12" r="9" /><Path d="M12 7v5l3 2" /></S>;
export const IconNav = (p: P) => <S {...p} fill={p.color ?? '#fff'}><Polygon points="3,11 22,2 13,21 11,13 3,11" /></S>;
export const IconBell = (p: P) => <S {...p}><Path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><Path d="M13.7 21a2 2 0 0 1-3.4 0" /></S>;
export const IconCheck = (p: P) => <S {...p}><Path d="M20 6 9 17l-5-5" /></S>;
