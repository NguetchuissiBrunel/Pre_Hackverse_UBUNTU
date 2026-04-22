"use client";

import { create } from 'zustand';
import { db } from '@/lib/db/dexie';
import { audioManager } from '@/lib/audio/audioManager';
import { calculateLevelFromXp } from '@/lib/gamification/engine';

type TimerMode = 'pomodoro' | 'deepwork' | 'sprint' | 'flow' | 'custom';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
  sessionStartTime: Date | null;
  expectedEndTime: number | null;
  pauseCount: number;
  activeDungeonId: string;
  isBerserkerMode: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  abandonSession: () => void;
  finishSession: () => void;
  resetTimer: () => void;
  setMode: (mode: TimerMode) => void;
  setActiveDungeon: (id: string) => void;
  toggleBerserkerMode: () => void;
  tick: () => void;
  syncFromState: (state: Partial<TimerState>) => void;
  savedTimes: Record<TimerMode, number>;
  activeTaskId: number | null;
  setActiveTask: (id: number | null) => void;
}

const MODE_DURATIONS: Record<TimerMode, number> = {
  pomodoro: 20 * 60,
  deepwork: 90 * 60,
  sprint: 15 * 60,
  flow: 0,
  custom: 60 * 60,
};

let timerInterval: NodeJS.Timeout | null = null;
const syncChannel = typeof window !== 'undefined' ? new BroadcastChannel('focusgrind_sync') : null;

export const useTimerStore = create<TimerState>((set, get) => ({
  timeLeft: 20 * 60,
  isRunning: false,
  mode: 'pomodoro',
  sessionStartTime: null,
  expectedEndTime: null,
  pauseCount: 0,
  activeDungeonId: 'neon_city',
  isBerserkerMode: false,
  savedTimes: { ...MODE_DURATIONS },
  activeTaskId: null,

  setActiveTask: (id: number | null) => set({ activeTaskId: id }),

  startTimer: () => {
    if (get().isRunning) return;

    const state = get();
    const duration = state.timeLeft;
    // En mode Flow, on n'utilise pas de endTime car c'est un chronomètre (compte-positif)
    const endTime = state.mode === 'flow' ? null : Date.now() + (duration * 1000);

    set({
      isRunning: true,
      expectedEndTime: endTime,
      sessionStartTime: state.timeLeft === MODE_DURATIONS[state.mode] ? new Date() : state.sessionStartTime
    });

    syncChannel?.postMessage({ 
      type: 'SYNC', 
      payload: { isRunning: true, expectedEndTime: endTime, timeLeft: duration, mode: state.mode } 
    });

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      get().tick();
    }, 1000);
  },

  pauseTimer: () => {
    if (!get().isRunning) return;

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    const state = get();
    const newState = {
      isRunning: false,
      expectedEndTime: null,
      pauseCount: state.pauseCount + 1
    };
    set(newState);
    syncChannel?.postMessage({ type: 'SYNC', payload: { ...newState, timeLeft: state.timeLeft } });
  },

  abandonSession: () => {
    const state = get();

    if (state.sessionStartTime && state.timeLeft < MODE_DURATIONS[state.mode]) {
      db.transaction('rw', db.sessions, db.user, async () => {
        await db.sessions.add({
          dateStart: state.sessionStartTime!,
          dateEnd: new Date(),
          duration: MODE_DURATIONS[state.mode] - state.timeLeft,
          type: state.mode,
          tag: 'Général',
          xp: 0,
          interrupted: true
        });

        if (state.isBerserkerMode) {
          const user = await db.user.get("me");
          if (user) {
            const newXp = Math.max(0, user.xp - 50);
            const newStats = calculateLevelFromXp(newXp);
            await db.user.update("me", { 
              xp: newXp,
              level: newStats.level
            });
          }
        }
      });
    }

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    set({
      isRunning: false,
      timeLeft: MODE_DURATIONS[state.mode],
      savedTimes: { ...state.savedTimes, [state.mode]: MODE_DURATIONS[state.mode] },
      sessionStartTime: null,
      expectedEndTime: null,
      pauseCount: 0,
      isBerserkerMode: false
    });
    syncChannel?.postMessage({ 
      type: 'SYNC', 
      payload: { isRunning: false, timeLeft: MODE_DURATIONS[state.mode], expectedEndTime: null, mode: state.mode } 
    });
  },

  finishSession: () => {
    const state = get();
    if (!state.isRunning && state.mode !== 'flow') return;

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    if (state.sessionStartTime && state.timeLeft > 0) {
      db.transaction('rw', db.sessions, db.user, async () => {
        const user = await db.user.get("me");
        if (!user) return;

        let xpMultiplier = 1.0;
        const durationSec = state.mode === 'flow' ? state.timeLeft : MODE_DURATIONS[state.mode];
        const durationMin = durationSec / 60;
        
        if (state.mode === 'flow' && durationMin > 120) xpMultiplier *= 1.5;

        if (user.talents.includes('disc_t1')) {
          const h = new Date().getHours();
          if (h < 9) xpMultiplier += 0.3;
        }
        if (durationMin >= 60) {
          if (user.talents.includes('focus_t3')) xpMultiplier += 0.2;
          else if (user.talents.includes('focus_t1')) xpMultiplier += 0.1;
        }
        if (state.isBerserkerMode) xpMultiplier *= 2.0;

        const baseXP = Math.floor(durationMin / 2.5) + 5;
        const finalXP = Math.floor(baseXP * xpMultiplier);
        
        const newTotalXp = user.xp + finalXP;
        const newStats = calculateLevelFromXp(newTotalXp);
        const levelDiff = newStats.level - user.level;
        const newTalentPoints = levelDiff > 0 ? user.talentPoints + levelDiff : user.talentPoints;

        await db.sessions.add({
          dateStart: state.sessionStartTime!,
          dateEnd: new Date(),
          duration: durationSec,
          type: state.mode,
          tag: 'Général',
          xp: finalXP,
          interrupted: false
        });

        if (state.activeTaskId && state.mode === 'pomodoro') {
          const task = await db.tasks.get(state.activeTaskId);
          if (task) {
            await db.tasks.update(state.activeTaskId, {
              actualPomodoros: (task.actualPomodoros || 0) + 1,
              updatedAt: new Date()
            });
          }
        }

        await db.user.update("me", {
          xp: newTotalXp,
          level: newStats.level,
          talentPoints: newTalentPoints,
          coins: user.coins + Math.floor(durationMin)
        });
      });
    }

    set({
      isRunning: false,
      timeLeft: MODE_DURATIONS[state.mode],
      savedTimes: { ...state.savedTimes, [state.mode]: MODE_DURATIONS[state.mode] },
      sessionStartTime: null,
      expectedEndTime: null,
      pauseCount: 0,
      isBerserkerMode: false
    });
    syncChannel?.postMessage({ 
      type: 'SYNC', 
      payload: { isRunning: false, timeLeft: MODE_DURATIONS[state.mode], expectedEndTime: null, mode: state.mode } 
    });
    audioManager.playSfx('end');
  },

  resetTimer: () => {
    audioManager.stopAllSfx();
    const state = get();
    set({
      isRunning: false,
      timeLeft: MODE_DURATIONS[state.mode],
      savedTimes: { ...state.savedTimes, [state.mode]: MODE_DURATIONS[state.mode] },
      sessionStartTime: null,
      pauseCount: 0
    });
  },

  setMode: (mode: TimerMode) => {
    const state = get();
    // Sauvegarder le temps actuel du mode actuel
    const updatedSavedTimes = {
      ...state.savedTimes,
      [state.mode]: state.timeLeft
    };

    // Charger le temps sauvegardé du nouveau mode
    const newTime = updatedSavedTimes[mode];

    set({
      mode,
      timeLeft: newTime,
      savedTimes: updatedSavedTimes,
      isRunning: false,
      expectedEndTime: null,
      sessionStartTime: null
    });
    syncChannel?.postMessage({ 
      type: 'SYNC', 
      payload: { mode, timeLeft: newTime, isRunning: false, expectedEndTime: null, savedTimes: updatedSavedTimes } 
    });
  },

  setActiveDungeon: (id: string) => set({ activeDungeonId: id }),

  toggleBerserkerMode: () => set((state: TimerState) => ({ isBerserkerMode: !state.isBerserkerMode })),

  tick: () => {
    const state = get();
    if (!state.isRunning) {
       // Stop interval if not running (safe check)
       if (timerInterval) {
         clearInterval(timerInterval);
         timerInterval = null;
       }
       return;
    }

    if (state.expectedEndTime) {
      const now = Date.now();
      const diff = Math.max(0, Math.round((state.expectedEndTime - now) / 1000));
      
      if (diff !== state.timeLeft) {
        set({ timeLeft: diff });
      }

      if (diff <= 0 && state.mode !== 'flow') {
        get().finishSession();
      }
    } else if (state.mode === 'flow') {
      set({ timeLeft: state.timeLeft + 1 });
    }
  },

  syncFromState: (payload: Partial<TimerState>) => {
    set((state: TimerState) => ({ ...state, ...payload }));
    if (payload.isRunning) {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        get().tick();
      }, 1000);
    } else if (payload.isRunning === false) {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  },
}));

if (syncChannel) {
  syncChannel.onmessage = (event) => {
    if (event.data.type === 'SYNC') {
      useTimerStore.getState().syncFromState(event.data.payload);
    }
  };
}
