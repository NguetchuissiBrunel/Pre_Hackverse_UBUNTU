import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/dexie";
import { useEffect } from "react";
import { calculateLevelFromXp } from "@/lib/gamification/engine";

const DAILY_QUESTS_TEMPLATES = [
  { id: 'daily_pomo_3', type: 'daily' as const, description: 'Faire 3 Pomodoros', target: 3, rewardXp: 50, rewardCoins: 10 },
  { id: 'daily_dw_1', type: 'daily' as const, description: 'Faire 1 session Deep Work', target: 1, rewardXp: 100, rewardCoins: 20 },
];

export function useQuests() {
  const quests = useLiveQuery(() => db.quests.toArray(), []);

  // Hydratation / Mise à jour au lancement
  useEffect(() => {
    const initQuests = async () => {
      const now = new Date();
      // On retire les quêtes daily expirées
      await db.quests.where('type').equals('daily').and(q => new Date(q.resetDate) < now).delete();

      const currentDailies = await db.quests.where('type').equals('daily').toArray();
      if (currentDailies.length === 0) {
        // Ajouter 2 nouvelles au hasard... Ou les 2 de base pour la V1
        const expiration = new Date();
        expiration.setHours(23, 59, 59, 999);

        for (const t of DAILY_QUESTS_TEMPLATES) {
          await db.quests.add({
            id: `${t.id}_${now.toISOString().split('T')[0]}`,
            type: t.type,
            title: t.description,
            target: t.target,
            progress: 0,
            rewardXp: t.rewardXp,
            rewardCoins: t.rewardCoins,
            claimed: false,
            resetDate: expiration.toISOString()
          });
        }
      }

      // Calcul des progressions (simplifié: on scan les sessions du jour et met à jour)
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todaysSessions = await db.sessions.where('dateStart').aboveOrEqual(startOfDay.toISOString()).toArray();
      const allQuests = await db.quests.toArray();

      const pomos = todaysSessions.filter(s => s.type === 'pomodoro' && !s.interrupted).length;
      const dw = todaysSessions.filter(s => s.type === 'deepwork' && !s.interrupted).length;

      for (const q of allQuests) {
        if (q.claimed) continue;

        let newProgress = q.progress;
        if (q.id.startsWith('daily_pomo_3')) {
          newProgress = pomos;
        } else if (q.id.startsWith('daily_dw_1')) {
          newProgress = dw;
        }

        if (newProgress !== q.progress) {
          await db.quests.update(q.id, { progress: Math.min(q.target, newProgress) });
        }
      }
    };

    initQuests();
  }, [quests?.length]); // relance ponctuellement ou juste au hook

  const claimQuest = async (questId: string) => {
    const q = await db.quests.get(questId);
    if (!q || q.claimed || q.progress < q.target) return;

    await db.quests.update(questId, { claimed: true });
    
    // Add XP & Coins
    const user = await db.user.get('me');
    if (user) {
      const newXp = user.xp + q.rewardXp;
      const newStats = calculateLevelFromXp(newXp);
      const levelDiff = newStats.level - user.level;
      const newTalentPoints = levelDiff > 0 ? user.talentPoints + levelDiff : user.talentPoints;

      await db.user.update('me', {
        xp: newXp,
        level: newStats.level,
        talentPoints: newTalentPoints,
        coins: user.coins + q.rewardCoins
      });
      alert(`Récompense récupérée ! +${q.rewardXp} XP`);
    }
  };

  return { quests: quests || [], claimQuest };
}
