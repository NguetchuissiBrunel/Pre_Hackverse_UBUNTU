import { db } from "@/lib/db/dexie";
import { startOfWeek, endOfWeek } from "date-fns";

export interface WeeklyBoss {
  id: string;
  name: string;
  targetMinutes: number;
  rewardXp: number;
  rewardCoins: number;
  description: string;
}

export const CURRENT_WEEK_BOSS: WeeklyBoss = {
  id: 'kraken_procrastination',
  name: 'Le Kraken de la Procrastination',
  targetMinutes: 600, // 10h par semaine
  rewardXp: 500,
  rewardCoins: 200,
  description: 'Un monstre titanesque qui dévore vos heures productives. Accumulez 10 heures de focus cette semaine pour le terrasser.'
};

export async function getWeeklyFocusMinutes() {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });

  const sessions = await db.sessions
    .where('dateStart')
    .between(start, end)
    .and(s => !s.interrupted)
    .toArray();

  const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0);
  return Math.floor(totalSeconds / 60);
}
