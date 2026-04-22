import { useLiveQuery } from "dexie-react-hooks";
import { db, User } from "@/lib/db/dexie";
import { useEffect } from "react";
import { calculateLevelFromXp } from "@/lib/gamification/engine";

export function useUser() {
  const user = useLiveQuery(() => db.user.get("me"));

  // Initialisation du joueur s'il n'existe pas
  useEffect(() => {
    const initUser = async () => {
      const existingUser = await db.user.get("me");
      if (!existingUser) {
        await db.user.add({
          id: "me",
          xp: 0,
          level: 1,
          coins: 0,
          streak: 0,
          talentPoints: 0,
          talents: [],
          inventory: {},
        });
      }
    };
    initUser();
  }, []);

  const stats = user ? calculateLevelFromXp(user.xp) : null;
  const processedUser = user ? { ...user, coins: Math.floor(user.coins) } : null;

  const addXp = async (amount: number) => {
    if (!user) return;
    const newXp = user.xp + amount;
    const newStats = calculateLevelFromXp(newXp);
    
    // Si on passe une (ou plusieurs) niveau(x)
    const levelDiff = newStats.level - user.level;
    const newTalentPoints = levelDiff > 0 ? user.talentPoints + levelDiff : user.talentPoints;

    await db.user.update("me", {
      xp: newXp,
      level: newStats.level,
      talentPoints: newTalentPoints,
    });
  };

  return { user: processedUser, stats, addXp };
}
