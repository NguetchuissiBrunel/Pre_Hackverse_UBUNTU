"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { db } from "@/lib/db/dexie";
import { calculateLevelFromXp } from "@/lib/gamification/engine";
import { useSyncStore } from "@/lib/store/useSyncStore";

export function useSync() {
  useEffect(() => {
    // 1. Monitor Auth Changes
    const { setSyncing } = useSyncStore.getState();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log("Utilisateur connecté, début de la synchronisation...");
        setSyncing(true);
        // Exécution en parallèle pour gagner en vitesse
        Promise.all([
          syncUserData(session.user),
          syncSessions(session.user)
        ])
        .catch(err => console.error("Erreur durant la synchro parallèle :", err))
        .finally(() => setSyncing(false));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const syncUserData = async (authUser: any) => {
    const localUser = await db.user.get("me");
    if (!localUser) return;

    // Check if profile exists in Supabase
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (!profile) {
      // Profile doesn't exist, create it with local data
      console.log("Création du profil distant...");
      await supabase.from('profiles').insert({
        id: authUser.id,
        username: authUser.user_metadata.username || 'Héros_Anonyme',
        xp: localUser.xp,
        level: localUser.level,
        coins: localUser.coins,
        streak: localUser.streak,
        talents: localUser.talents,
        title: 'Recrue'
      });
    } else if (profile) {
      // Profile exists, merge (prioritize higher XP)
      console.log("Profil distant trouvé, fusion des données...");
      const finalXp = Math.max(localUser.xp, profile.xp);
      const stats = calculateLevelFromXp(finalXp);

      await db.user.update("me", {
        xp: finalXp,
        level: stats.level,
        coins: Math.max(localUser.coins, profile.coins),
        talents: Array.from(new Set([...localUser.talents, ...(profile.talents || [])])),
      });

      // Update Supabase with merged values
      await supabase.from('profiles').update({
        xp: finalXp,
        level: stats.level,
        talents: Array.from(new Set([...localUser.talents, ...(profile.talents || [])])),
      }).eq('id', authUser.id);
    }
  };

  const syncSessions = async (authUser: any) => {
    try {
      const localSessions = await db.sessions.toArray();
      const { data: remoteSessions, error: fetchError } = await supabase
        .from('sessions')
        .select('date_start')
        .eq('user_id', authUser.id);

      if (fetchError) throw fetchError;

      const remoteDates = new Set(remoteSessions?.map(s => new Date(s.date_start).getTime()));
      const toSync = localSessions
        .filter(s => !remoteDates.has(new Date(s.dateStart).getTime()))
        .map(s => ({
          user_id: authUser.id,
          date_start: s.dateStart,
          date_end: s.dateEnd,
          duration: s.duration,
          type: s.type,
          xp: s.xp,
          interrupted: s.interrupted,
          tag: s.tag
        }));

      if (toSync.length > 0) {
        console.log(`Synchronisation de ${toSync.length} sessions...`);
        const { error: insertError } = await supabase.from('sessions').insert(toSync);
        if (insertError) throw insertError;
        console.log("Synchronisation réussie !");
      }
    } catch (err: any) {
      if (err.code === '42501') {
        console.error("Erreur de permission Supabase : Avez-vous exécuté le script SQL ?");
      } else {
        console.error("Échec de la synchronisation :", err.message);
      }
    }
  };
}
