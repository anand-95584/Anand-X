export interface EmoteItem {
  id: string;
  name: string;
  icon: string;
  animationType: 'LAUGH' | 'BOOYAH_FLAG' | 'THRONE_SIT' | 'FLOSS_DANCE' | 'FLOWER_GIFT' | 'CLAP_HANDS' | 'MUSCLE_FLEX' | 'HEART_SIGN';
  description: string;
  duration: number; // in milliseconds
  particleColor?: string;
}

export interface QuickChatMessage {
  id: string;
  text: string;
  icon: string;
  category: 'TACTICAL' | 'SOCIAL' | 'COMMAND';
}

export const EMOTES: EmoteItem[] = [
  {
    id: 'LOL',
    name: 'LOL Laugh',
    icon: '😂',
    animationType: 'LAUGH',
    description: 'Laugh loudly at defeated foes!',
    duration: 3000,
    particleColor: '#f59e0b',
  },
  {
    id: 'BOOYAH',
    name: 'Booyah Flag',
    icon: '🏆',
    animationType: 'BOOYAH_FLAG',
    description: 'Plant the golden Booyah flag of victory!',
    duration: 3500,
    particleColor: '#eab308',
  },
  {
    id: 'THRONE',
    name: 'FF Throne',
    icon: '🪑',
    animationType: 'THRONE_SIT',
    description: 'Summon the golden glowing throne and rest like a boss!',
    duration: 4000,
    particleColor: '#facc15',
  },
  {
    id: 'FLOSS',
    name: 'Floss Dance',
    icon: '🕺',
    animationType: 'FLOSS_DANCE',
    description: 'Perform the iconic fast floss dance move!',
    duration: 3000,
    particleColor: '#06b6d4',
  },
  {
    id: 'FLOWER',
    name: 'Rose Propose',
    icon: '🌹',
    animationType: 'FLOWER_GIFT',
    description: 'Present a bouquet of red roses to your teammate!',
    duration: 3000,
    particleColor: '#ef4444',
  },
  {
    id: 'CLAP',
    name: 'Applause',
    icon: '👏',
    animationType: 'CLAP_HANDS',
    description: 'Give a round of applause for a great play!',
    duration: 2500,
    particleColor: '#10b981',
  },
  {
    id: 'FLEX',
    name: 'Muscle Flex',
    icon: '💪',
    animationType: 'MUSCLE_FLEX',
    description: 'Flex your muscles to show peak power!',
    duration: 3000,
    particleColor: '#8b5cf6',
  },
  {
    id: 'HEART',
    name: 'Love Heart',
    icon: '❤️',
    animationType: 'HEART_SIGN',
    description: 'Form a glowing heart sign in the air!',
    duration: 3000,
    particleColor: '#ec4899',
  },
];

export const QUICK_CHAT_MESSAGES: QuickChatMessage[] = [
  { id: 'ENEMY_SPOTTED', text: 'Enemy Spotted!', icon: '🎯', category: 'TACTICAL' },
  { id: 'NEED_MEDKIT', text: 'I Need Medkits!', icon: '💊', category: 'TACTICAL' },
  { id: 'STAY_TOGETHER', text: 'Stay Together!', icon: '🛡️', category: 'TACTICAL' },
  { id: 'HELP_ME', text: 'Help Me!', icon: '🆘', category: 'TACTICAL' },
  { id: 'COVER_ME', text: 'Cover Me!', icon: '🔫', category: 'COMMAND' },
  { id: 'GOOD_JOB', text: 'Good Job!', icon: '👍', category: 'SOCIAL' },
  { id: 'RUSH_ENEMY', text: 'Rush the Enemy!', icon: '⚡', category: 'COMMAND' },
  { id: 'SAFE_ZONE', text: 'Get to Safe Zone!', icon: '🏃', category: 'COMMAND' },
];
