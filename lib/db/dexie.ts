import Dexie, { type EntityTable } from 'dexie';

export interface Session {
  id?: number;
  dateStart: Date;
  dateEnd: Date;
  duration: number;      // en secondes
  type: 'pomodoro' | 'deepwork' | 'sprint' | 'flow' | 'custom';
  tag: string;
  xp: number;
  interrupted: boolean;
  energy?: 1 | 2 | 3 | 4 | 5;
}

export interface Tag {
  id?: number;
  name: string;
  color: string;
  totalMinutes: number;
  goalMinutes?: number;
}

export interface User {
  id: string; // usually a single row "me"
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastSessionDate?: Date;
  talentPoints: number;
  talents: string[]; // IDs des talents débloqués
  inventory: Record<string, number>; // ID de l'objet -> Quantité
}

export interface Quest {
  id: string;
  type: 'daily' | 'weekly';
  description: string;
  target: number;
  progress: number;
  rewardXp: number;
  rewardCoins: number;
  expiresAt: Date;
  done: boolean;
}

export interface Preset {
  id?: number;
  name: string;
  steps: { type: string; duration: number }[];
}

export interface Routine {
  id?: number;
  name: string;
  sessionIds: number[];
}

export interface Trophy {
  id: string;
  unlockedAt: Date;
}

export interface Setting {
  key: string;
  value: any;
}

const db = new Dexie('FocusGrindDB') as Dexie & {
  sessions: EntityTable<Session, 'id'>;
  tags: EntityTable<Tag, 'id'>;
  user: EntityTable<User, 'id'>;
  quests: EntityTable<Quest, 'id'>;
  presets: EntityTable<Preset, 'id'>;
  routines: EntityTable<Routine, 'id'>;
  trophies: EntityTable<Trophy, 'id'>;
  settings: EntityTable<Setting, 'key'>;
};

// Schema declaration
db.version(1).stores({
  sessions: '++id, dateStart, dateEnd, duration, type, tag, xp, interrupted',
  tags: '++id, &name, color, totalMinutes, goalMinutes',
  user: 'id, xp, level, coins, streak, lastSessionDate, talentPoints, talents, inventory',
  quests: 'id, type, description, target, progress, rewardXp, rewardCoins, expiresAt, done',
  presets: '++id, name, steps',
  routines: '++id, name, sessionIds',
  trophies: 'id, unlockedAt',
  settings: 'key, value'
});

export { db };
