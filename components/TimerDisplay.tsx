"use client";

import { useEffect, useState, useRef } from "react";
import { useTimerStore } from "@/lib/store/useTimerStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, RotateCcw, Volume2, VolumeX, ListTodo, ChevronDown, CheckCircle2 } from "lucide-react";
import { audioManager } from "@/lib/audio/audioManager";
import PenaltyModal from "./PenaltyModal";
import { usePenaltyBox } from "@/hooks/usePenaltyBox";
import { useUser } from "@/hooks/useUser";
import { useTasks } from "@/hooks/useTasks";
import AudioMixer from "./AudioMixer";


export default function TimerDisplay() {
  const { 
    timeLeft, isRunning, mode, pauseCount, isBerserkerMode, activeTaskId,
    startTimer, pauseTimer, abandonSession, finishSession, resetTimer, setMode, toggleBerserkerMode, setActiveTask
  } = useTimerStore();
  const { user } = useUser();
  const { tasks } = useTasks();
  const [soundEnabled, setSoundEnabled] = useState(audioManager.soundEnabled);
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const { isLocked, lockedRemaining } = usePenaltyBox();
  
  const activeTask = tasks.find(t => t.id === activeTaskId);
  
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const visibilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleSound = () => {
    const isNowEnabled = audioManager.toggleSound();
    setSoundEnabled(isNowEnabled);
  };

  const handleStopClick = () => {
    if (mode === 'flow') {
      if (timeLeft > 0) finishSession();
      return;
    }

    if (isRunning || pauseCount > 0) {
      if (timeLeft === 0) return; 
      setShowPenaltyModal(true);
      pauseTimer(); 
    } else {
      abandonSession(); 
    }
  };

  const confirmAbandon = () => {
    setShowPenaltyModal(false);
    if (mode === 'flow') {
      finishSession();
    } else {
      abandonSession();
    }
  };

  // Notifications logic
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const sendNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/logo.png" });
    }
  };

  // Les fonctions de décompte (tick) sont maintenant gérées par le store global !
  
  // Wake Lock & Visibility Logic
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && isRunning) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch (err: unknown) {
        console.warn(`${err instanceof Error ? err.name : 'Error'}, ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };

    if (isRunning) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (visibilityTimeoutRef.current) clearTimeout(visibilityTimeoutRef.current);
      } else {
        if (isRunning) {
          visibilityTimeoutRef.current = setTimeout(() => {
            console.log("Onglet caché trop longtemps ! Mise en pause forcée.");
            audioManager.playSfx('pause');
            sendNotification("Focus Interrompu !", "Vous avez quitté l'application trop longtemps. Session mise en pause.");
            pauseTimer(); 
          }, 10000);
        }
      }
      
      if (document.visibilityState === 'visible' && isRunning && wakeLockRef.current === null) {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      releaseWakeLock();
      if (visibilityTimeoutRef.current) clearTimeout(visibilityTimeoutRef.current);
    };
  }, [isRunning, pauseTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const circumference = 2 * Math.PI * 120;
  // Les durées doivent correspondre exactement à celles définies dans useTimerStore.ts
  const maxTime = mode === 'pomodoro' ? 20 * 60 : mode === 'deepwork' ? 90 * 60 : mode === 'sprint' ? 15 * 60 : 3600;
  const strokeDashoffset = mode === 'flow' ? 0 : Math.max(0, circumference - (timeLeft / maxTime) * circumference);

  // --- Logique Dynamique des Talents ---
  const hasBerserkerTalent = user?.talents.includes('pow_t1');
  const maxPauses = 3 + (user?.talents.includes('focus_t2') ? 1 : 0) + (user?.talents.includes('pow_t2') ? 1 : 0);

  return (
    <>
      <PenaltyModal 
        isOpen={showPenaltyModal} 
        onClose={() => setShowPenaltyModal(false)}
        onConfirmAbandon={confirmAbandon}
      />

      <div className="relative flex flex-col items-center justify-center p-8 bg-glass-dark border border-neon-cyan/30 rounded-3xl backdrop-blur-md shadow-neon-cyan/20 w-full max-w-sm">

        {/* Audio Mixer */}
        <div className="absolute top-4 left-6">
          <AudioMixer />
        </div>

        {/* Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className="absolute top-4 right-6 p-3 rounded-full bg-glass-dark border border-white/10 text-neon-cyan/70 hover:text-neon-cyan transition-colors"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>



        {/* Mode Selector */}
        <div className="flex gap-2 mb-8 mt-10 flex-wrap justify-center w-full">
          {(['pomodoro', 'deepwork', 'sprint', 'flow'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
              }}
              disabled={isRunning || isLocked}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                mode === m 
                  ? 'bg-neon-cyan text-oled-black shadow-neon-cyan opacity-100' 
                  : 'text-neon-cyan/70 border border-neon-cyan/50 hover:text-neon-cyan hover:border-neon-cyan opacity-60'
              } ${isRunning || isLocked ? 'cursor-not-allowed opacity-30 disabled:hover:border-neon-cyan/50 disabled:hover:text-neon-cyan/70' : ''}`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Task Selector */}
        <div className="w-full mb-6 relative">
          <button
            onClick={() => !isRunning && setShowTaskSelector(!showTaskSelector)}
            disabled={isRunning}
            className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all font-rajdhani ${
              isRunning ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/10' : 
              'bg-white/5 border-white/10 hover:border-neon-cyan/50 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <ListTodo size={16} className={activeTask ? 'text-neon-cyan' : 'text-gray-500'} />
              <span className={`text-xs font-bold truncate ${activeTask ? 'text-white' : 'text-gray-500 uppercase tracking-widest'}`}>
                {activeTask ? activeTask.title : 'Sélectionner une tâche'}
              </span>
            </div>
            <ChevronDown size={14} className={`text-gray-500 transition-transform ${showTaskSelector ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showTaskSelector && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowTaskSelector(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-oled-black border border-white/20 rounded-xl overflow-hidden z-30 shadow-2xl max-h-48 overflow-y-auto"
                >
                  <button
                    onClick={() => {
                      setActiveTask(null);
                      setShowTaskSelector(false);
                    }}
                    className="w-full p-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-white/5 border-b border-white/5"
                  >
                    Aucune tâche
                  </button>
                  {tasks.filter(t => !t.completed).map(task => (
                    <button
                      key={task.id}
                      onClick={() => {
                        setActiveTask(task.id!);
                        setShowTaskSelector(false);
                      }}
                      className={`w-full p-3 text-left flex items-center justify-between hover:bg-neon-cyan/10 transition-colors ${activeTaskId === task.id ? 'bg-neon-cyan/5' : ''}`}
                    >
                      <span className={`text-xs font-bold truncate ${activeTaskId === task.id ? 'text-neon-cyan' : 'text-white'}`}>
                        {task.title}
                      </span>
                      {activeTaskId === task.id && <CheckCircle2 size={12} className="text-neon-cyan" />}
                    </button>
                  ))}
                  {tasks.filter(t => !t.completed).length === 0 && (
                    <div className="p-4 text-center">
                      <p className="text-[10px] text-gray-500 uppercase">Aucune tâche active</p>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Timer Circle */}
        <div className="relative flex items-center justify-center mb-10 group">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle cx="128" cy="128" r="120" className="stroke-neon-cyan/10" strokeWidth="6" fill="transparent" />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              className={`stroke-neon-cyan drop-shadow-[0_0_15px_rgba(0,243,255,0.8)] ${isLocked ? 'stroke-red-500 drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]' : ''}`}
              strokeWidth="6"
              fill="transparent"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "linear" }}
              style={{ strokeDasharray: circumference }}
            />
          </svg>

          {/* Time Text */}
          <div className="absolute flex flex-col items-center">
            {isLocked ? (
              <span className="text-4xl font-bold text-red-500 text-glow-magenta mb-2">VERROUILLÉ</span>
            ) : (
              <motion.span 
                className="text-6xl font-bold text-white text-glow-cyan font-rajdhani"
                animate={isRunning ? { scale: [1, 1.02, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {formatTime(timeLeft)}
              </motion.span>
            )}
            
            <span className={`uppercase tracking-[0.2em] text-xs ${isLocked ? 'text-red-400' : 'text-neon-cyan/80'}`}>
              {isLocked ? `Attendez ${lockedRemaining} min` : mode}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex gap-6">
            {!isRunning ? (
              <motion.button
                whileHover={!isLocked ? { scale: 1.1, boxShadow: "0 0 20px #00f3ff" } : {}}
                whileTap={!isLocked ? { scale: 0.9 } : {}}
                onClick={startTimer}
                disabled={isLocked}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors group/btn ${
                  isLocked ? 'bg-red-900/50 text-red-500 cursor-not-allowed border-2 border-red-500/50' : 'bg-neon-cyan text-oled-black hover:animate-glitch'
                }`}
              >
                <Play fill="currentColor" size={28} className="translate-x-0.5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px #ffaa00" }}
                whileTap={{ scale: 0.9 }}
                onClick={pauseTimer}
                disabled={mode !== 'flow' && pauseCount >= maxPauses}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  mode !== 'flow' && pauseCount >= maxPauses ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-neon-orange text-oled-black'
                }`}
              >
                <Pause fill="currentColor" size={28} />
              </motion.button>
            )}

            {(mode !== 'flow' || (mode === 'flow' && timeLeft > 0)) && (
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: mode === 'flow' ? "0 0 20px #00f3ff" : "0 0 20px #ff00ff" }}
                whileTap={{ scale: 0.9 }}
                onClick={handleStopClick}
                className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-colors ${
                  mode === 'flow' 
                    ? 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-oled-black' 
                    : 'border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-white'
                }`}
              >
                {mode === 'flow' ? <CheckCircle2 size={24} /> : <Square fill="currentColor" size={20} />}
              </motion.button>
            )}
          </div>

          {/* Reset Button (Finished mode OR Flow mode) */}
          {((timeLeft === 0 && mode !== 'flow' && !isRunning) || (mode === 'flow' && timeLeft > 0)) && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              onClick={resetTimer}
              className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-tighter text-white/70 hover:text-neon-cyan hover:border-neon-cyan transition-all"
            >
              <RotateCcw size={14} /> Réinitialiser
            </motion.button>
          )}
          
          {/* Status Pause/Abandons */}
          <div className="h-4 flex flex-col items-center gap-1">
            {isBerserkerMode && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-[9px] text-neon-magenta font-black uppercase tracking-[0.2em]"
              >
                Mode Berserker Actif (XP x2)
              </motion.span>
            )}
          </div>
        </div>

        {/* Talent Toggles (Berserker) */}
        {hasBerserkerTalent && !isRunning && (
          <div className="mt-8 pt-6 border-t border-white/5 w-full flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-neon-magenta uppercase tracking-widest">Berserker</span>
              <span className="text-[8px] text-gray-500 uppercase">Risque maximal, XP x2</span>
            </div>
            <button 
              onClick={toggleBerserkerMode}
              className={`w-12 h-6 rounded-full relative transition-colors ${isBerserkerMode ? 'bg-neon-magenta shadow-[0_0_10px_#ff00ff]' : 'bg-white/10'}`}
            >
              <motion.div 
                animate={{ x: isBerserkerMode ? 26 : 2 }}
                className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-md"
              />
            </button>
          </div>
        )}

      </div>
    </>
  );
}
