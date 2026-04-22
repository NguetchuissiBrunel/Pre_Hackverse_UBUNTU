"use client";

import { useState } from "react";
import { QuestsView } from "@/components/QuestsView";
import { TasksView } from "@/components/TasksView";
import { Target, ListTodo } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ObjectivesPage() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'quests'>('tasks');

  return (
    <main className="min-h-screen bg-oled-black">
      {/* Tab Switcher - Fixed at the top under the main header area */}
      <div className="fixed top-24 left-0 w-full z-20 px-6 flex justify-center">
        <div className="w-full max-w-md bg-glass-dark border border-white/10 p-1 rounded-xl flex shadow-2xl backdrop-blur-xl">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
              activeTab === 'tasks' 
                ? 'bg-neon-cyan text-oled-black shadow-neon-cyan' 
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <ListTodo size={14} /> Mes Tâches
          </button>
          <button 
            onClick={() => setActiveTab('quests')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
              activeTab === 'quests' 
                ? 'bg-neon-orange text-oled-black shadow-neon-orange' 
                : 'text-gray-500 hover:text-white'
            }`}
          >
            <Target size={14} /> Contrats
          </button>
        </div>
      </div>

      <div className="pt-16">
        <AnimatePresence mode="wait">
          {activeTab === 'tasks' ? (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <TasksView isNested />
            </motion.div>
          ) : (
            <motion.div
              key="quests"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <QuestsView isNested />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
