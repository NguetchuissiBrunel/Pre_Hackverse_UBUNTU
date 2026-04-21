import Dexie, { Table } from 'dexie';

export interface User {
  id: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  talentPoints: number;
  talents: string[];
  inventory?: Record<string, number>;
}

export interface Session {
  id?: number;
  dateStart: string;
  dateEnd: string;
  duration: number;
  type: 'pomodoro' | 'deepwork' | 'sprint' | 'flow' | 'custom';
  xp: number;
  interrupted: boolean;
  tag?: string;
  synced?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'milestone';
  target: number;
  progress: number;
  rewardXp: number;
  rewardCoins: number;
  claimed: boolean;
  resetDate: string;
}

export class FocusGrindDB extends Dexie {
  user!: Table<User>;
  sessions!: Table<Session>;
  quests!: Table<Quest>;

  constructor() {
    super('FocusGrindDB');
    this.version(3).stores({
      user: 'id',
      sessions: '++id, dateStart, type, synced',
      quests: 'id, type, claimed, resetDate'
    });
  }
}

export const db = new FocusGrindDB();
