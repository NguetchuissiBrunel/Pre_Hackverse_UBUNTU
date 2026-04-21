import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/dexie";
import { useState, useEffect } from "react";

export function usePenaltyBox() {
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockedRemaining, setLockedRemaining] = useState(0);

  // Define 04:00 AM of today
  const getTodayResetTime = () => {
    const now = new Date();
    const reset = new Date(now);
    reset.setHours(4, 0, 0, 0);
    if (now < reset) {
      // If it's before 4 AM, "today" started yesterday at 4 AM
      reset.setDate(reset.getDate() - 1);
    }
    return reset;
  };

  const abandonsToday = useLiveQuery(async () => {
    const startOfToday = getTodayResetTime();
    return await db.sessions
      .where('dateStart')
      .aboveOrEqual(startOfToday)
      .and(session => session.interrupted === true)
      .count();
  }, []);

  useEffect(() => {
    if (abandonsToday === undefined || abandonsToday < 3) {
      setIsLocked(false);
      setLockedUntil(null);
      return;
    }

    // Calcul de la pénalité: 10 * 2^(nb_abandons - 3)
    const penaltyMinutes = 10 * Math.pow(2, abandonsToday - 3);
    
    // Find the last abandonment time
    db.sessions
      .where('dateStart')
      .aboveOrEqual(getTodayResetTime())
      .and(s => s.interrupted === true)
      .reverse()
      .sortBy('dateEnd')
      .then(sessions => {
        if (sessions.length > 0) {
          const lastAbandonsTime = sessions[0].dateEnd;
          const unlockTime = new Date(lastAbandonsTime.getTime() + penaltyMinutes * 60000);
          
          setLockedUntil(unlockTime);
          
          const now = new Date();
          if (now < unlockTime) {
            setIsLocked(true);
            setLockedRemaining(Math.ceil((unlockTime.getTime() - now.getTime()) / 60000));
          } else {
            setIsLocked(false);
          }
        }
      });
  }, [abandonsToday]);

  // Hook pour mettre à jour le temps restant en temps réel (minute par minute)
  useEffect(() => {
    if (!isLocked || !lockedUntil) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      if (now >= lockedUntil) {
        setIsLocked(false);
      } else {
        setLockedRemaining(Math.ceil((lockedUntil.getTime() - now.getTime()) / 60000));
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [isLocked, lockedUntil]);

  return { isLocked, lockedRemaining, abandonsToday: abandonsToday || 0 };
}
