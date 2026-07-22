export type GameMode = 'BATTLE_ROYALE' | 'CLASH_SQUAD' | 'TRAINING';

export type WeaponId = 'AK47' | 'MP40' | 'M1014' | 'AWM' | 'SCAR' | 'DESERT_EAGLE' | 'PAN';

export interface Weapon {
  id: WeaponId;
  name: string;
  category: 'AR' | 'SMG' | 'SHOTGUN' | 'SNIPER' | 'PISTOL' | 'MELEE';
  damage: number;
  headshotMultiplier: number;
  fireRate: number; // shots per sec
  magazineSize: number;
  reloadTime: number; // seconds
  range: number;
  accuracy: number; // 0-100
  ammoType: 'AR' | 'SMG' | 'SG' | 'SNIPER' | 'HG' | 'NONE';
  description: string;
}

export type CharacterId = 'KELLY' | 'ANDREW' | 'MAXIM' | 'PALOMA' | 'HAYATO' | 'ALOK';

export interface Character {
  id: CharacterId;
  name: string;
  title: string;
  skillName: string;
  skillType: 'ACTIVE' | 'PASSIVE';
  description: string;
  cooldown?: number; // for active skill in sec
  avatarBg: string;
  color: string;
  unlocked: boolean;
  cost: number; // gold coins
}

export interface WeaponSkin {
  id: string;
  weaponId: WeaponId;
  name: string;
  rarity: 'RARE' | 'EPIC' | 'LEGENDARY';
  damageBonus: number;
  rateBonus: number;
  accuracyBonus: number;
  color: string;
  glowColor: string;
  unlocked: boolean;
  cost: number;
}

export interface GlooWallSkin {
  id: string;
  name: string;
  color: string;
  emblem: string;
  unlocked: boolean;
  cost: number;
}

export interface OGBundle {
  id: string;
  name: string;
  season: string; // e.g. "SEASON 1", "SEASON 2", "SEASON 3", "OG RARE"
  rarity: 'MYTHIC' | 'LEGENDARY' | 'OG_RARE';
  color: string;
  glowColor: string;
  icon: string;
  description: string;
  unlocked: boolean;
  cost: number;
}

export interface PlayerStats {
  gold: number;
  diamonds: number;
  totalMatches: number;
  booyahs: number;
  totalKills: number;
  headshots: number;
  maxKillsInMatch: number;
  rankPoints: number; // e.g. 1000 = Gold, 2000 = Heroic, 3000 = Grandmaster
  selectedCharacter: CharacterId;
  selectedBundle?: string;
  selectedSkins: Record<WeaponId, string>;
  selectedGlooSkin: string;
  unlockedCharacters: CharacterId[];
  unlockedSkins: string[];
}

export interface ItemLoot {
  id: string;
  type: 'WEAPON' | 'AMMO' | 'MEDKIT' | 'GLOO_WALL' | 'VEST' | 'HELMET' | 'MUSHROOM';
  weaponId?: WeaponId;
  ammoType?: 'AR' | 'SMG' | 'SG' | 'SNIPER' | 'HG';
  amount?: number;
  level?: 1 | 2 | 3;
  x: number;
  y: number;
  z: number;
}

export interface PlayerState {
  id: string;
  name: string;
  isBot: boolean;
  isAlive: boolean;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  hp: number;
  maxHp: number;
  ep: number; // Energy Points from mushrooms
  maxEp: number;
  armorVest: number; // 0, 1, 2, 3
  armorVestHp: number;
  helmet: number; // 0, 1, 2, 3
  helmetHp: number;
  
  // Inventory
  primaryWeapon: Weapon | null;
  secondaryWeapon: Weapon | null;
  meleeWeapon: Weapon | null;
  currentWeaponIndex: 0 | 1 | 2; // 0: primary, 1: secondary, 2: melee
  ammo: {
    AR: number;
    SMG: number;
    SG: number;
    SNIPER: number;
    HG: number;
  };
  currentMagAmmo: [number, number, number]; // for primary, secondary, melee
  medkits: number;
  glooWalls: number;
  
  // States
  isSprinting: boolean;
  isCrouching: boolean;
  isProning: boolean;
  isReloading: boolean;
  isHealing: boolean;
  isScoped: boolean;
  inVehicle: boolean;
  vehicleId?: string;
  
  // Skill
  characterId: CharacterId;
  skillCooldownRemaining: number;
  activeSkillDurationRemaining: number;
  
  // Kills
  kills: number;
  damageDealt: number;

  // Emotes & Chat
  activeEmote?: {
    id: string;
    name: string;
    icon: string;
    animationType: string;
    particleColor?: string;
    expiresAt: number;
  } | null;
  activeChatBubble?: {
    text: string;
    icon: string;
    expiresAt: number;
  } | null;
}

export interface ChatLogEntry {
  id: string;
  senderName: string;
  isPlayer: boolean;
  text: string;
  icon?: string;
  time: number;
}

export interface GlooWallEntity {
  id: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  hp: number;
  maxHp: number;
  ownerId: string;
  color: string;
}

export interface VehicleEntity {
  id: string;
  type: 'JEEP' | 'SPORTS_CAR' | 'MONSTER_TRUCK' | 'PICKUP';
  name: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  speed: number;
  maxSpeed: number;
  acceleration: number;
  hp: number;
  maxHp: number;
  driverId?: string;
  isEngineRunning?: boolean;
}

export interface AirDropEntity {
  id: string;
  x: number;
  y: number;
  z: number;
  isLanded: boolean;
  looted: boolean;
  items: ItemLoot[];
}

export interface KillFeedEntry {
  id: string;
  killerName: string;
  victimName: string;
  weaponName: string;
  isHeadshot: boolean;
  time: number;
}

export interface DamageIndicator {
  id: string;
  damage: number;
  isHeadshot: boolean;
  x: number;
  y: number;
  z: number;
  createdAt: number;
}
