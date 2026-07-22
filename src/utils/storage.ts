import { PlayerStats, WeaponId } from '../types/game';

const STORAGE_KEY = 'FREE_FIRE_2019_STATS';

export const INITIAL_STATS: PlayerStats = {
  gold: 3500,
  diamonds: 10000,
  totalMatches: 0,
  booyahs: 0,
  totalKills: 0,
  headshots: 0,
  maxKillsInMatch: 0,
  rankPoints: 1250, // Gold II rank
  selectedCharacter: 'ALOK',
  selectedBundle: 'BUNDLE_S1_SAKURA',
  selectedSkins: {
    AK47: 'AK_FLAMING_DRAGON',
    MP40: 'MP40_POKER',
    M1014: 'M1014_DEFAULT',
    AWM: 'AWM_DEFAULT',
    SCAR: 'SCAR_TITAN',
    DESERT_EAGLE: 'DE_DEFAULT',
    PAN: 'PAN_DEFAULT',
  },
  selectedGlooSkin: 'GLOO_CLASSIC',
  unlockedCharacters: ['ALOK', 'KELLY', 'ANDREW', 'MAXIM', 'PALOMA', 'HAYATO'],
  unlockedSkins: ['AK_FLAMING_DRAGON', 'MP40_POKER', 'SCAR_TITAN', 'GLOO_CLASSIC', 'GLOO_DRAGON'],
};

export const loadPlayerStats = (): PlayerStats => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const allCharIds = ['ALOK', 'KELLY', 'ANDREW', 'MAXIM', 'PALOMA', 'HAYATO'];
      const mergedCharacters = Array.from(new Set([...(parsed.unlockedCharacters || []), ...allCharIds]));

      return {
        ...INITIAL_STATS,
        ...parsed,
        diamonds: Math.max(10000, parsed.diamonds ?? 10000),
        unlockedCharacters: mergedCharacters as any,
      };
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return INITIAL_STATS;
};

export const savePlayerStats = (stats: PlayerStats): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
};

export const getRankTitle = (points: number): { title: string; color: string; badge: string } => {
  if (points >= 3200) return { title: 'GRANDMASTER', color: 'text-amber-400', badge: '👑' };
  if (points >= 2500) return { title: 'HEROIC', color: 'text-red-500', badge: '🔥' };
  if (points >= 2000) return { title: 'DIAMOND', color: 'text-cyan-400', badge: '💎' };
  if (points >= 1600) return { title: 'PLATINUM', color: 'text-purple-400', badge: '⭐' };
  if (points >= 1200) return { title: 'GOLD', color: 'text-yellow-400', badge: '🥇' };
  if (points >= 800) return { title: 'SILVER', color: 'text-slate-300', badge: '🥈' };
  return { title: 'BRONZE', color: 'text-amber-700', badge: '🥉' };
};
