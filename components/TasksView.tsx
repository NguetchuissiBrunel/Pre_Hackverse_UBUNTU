"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Search,
  LayoutGrid,
  List as ListIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/lib/db/dexie";

export function TasksView({ isNested = false }: { isNested?: boolean }) {
  const { tasks, addTask, deleteTask, toggleTaskCompleted } = useTasks();
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    estimatedPomodoros: number;
  }>({
    title: "",
    description: "",
    priority: "medium",
    estimatedPomodoros: 1
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    await addTask({
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      estimatedPomodoros: newTask.estimatedPomodoros,
      completed: false
    });

    setNewTask({ title: "", description: "", priority: "medium", estimatedPomodoros: 1 });
    setIsAdding(false);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  }).filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <main className={`min-h-screen pb-40 bg-oled-black bg-grid-cyber flex flex-col items-center relative overflow-x-hidden p-6 ${isNested ? 'pt-24' : 'pt-12'}`}>

      {/* Header Decorations */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-neon-cyan/10 to-transparent pointer-events-none" />

      <div className="w-full max-w-2xl z-10 flex flex-col gap-8">

        {/* Page Title */}
        <div className="flex justify-between items-end mt-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white text-glow-cyan flex items-center gap-3">
              <LayoutGrid className="text-neon-cyan" /> TERMINAL_TÂCHES
            </h1>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-1">
              Protocole d&apos;exécution : {pendingCount} actifs // {completedCount} terminés
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="bg-neon-cyan text-oled-black p-3 rounded-xl shadow-neon-cyan flex items-center gap-2 font-black uppercase text-xs"
          >
            <Plus size={18} /> Nouvelle Tâche
          </motion.button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Rechercher une directive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all font-rajdhani"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === f
                    ? 'bg-white/10 text-neon-cyan border border-neon-cyan/50'
                    : 'text-gray-500 hover:text-white border border-transparent'
                  }`}
              >
                {f === 'all' ? 'Tous' : f === 'pending' ? 'Actifs' : 'Finis'}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl"
              >
                <div className="p-4 bg-white/5 rounded-full text-gray-600 mb-4">
                  <ListIcon size={32} />
                </div>
                <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Aucune tâche trouvée dans ce secteur</p>
              </motion.div>
            ) : (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTaskCompleted(task)}
                  onDelete={() => task.id && deleteTask(task.id)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-oled-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-glass-dark border border-neon-cyan/30 rounded-3xl p-8 relative z-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
                <Plus className="text-neon-cyan" /> Initialiser Directive
              </h2>

              <form onSubmit={handleAddTask} className="flex flex-col gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block">Titre</label>
                  <input
                    autoFocus
                    type="text"
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Qu'allez-vous accomplir ?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-neon-cyan transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block">Description (Optionnel)</label>
                  <textarea
                    value={newTask.description}
                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Détails du protocole..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-neon-cyan transition-all h-24 resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block">Priorité</label>
                    <select
                      value={newTask.priority}
                      onChange={e => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-neon-cyan transition-all appearance-none"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block">Pomos Est.</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newTask.estimatedPomodoros}
                      onChange={e => setNewTask({ ...newTask, estimatedPomodoros: parseInt(e.target.value) || 1 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-neon-cyan transition-all text-center"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 rounded-xl border border-white/10 text-white font-bold uppercase text-xs hover:bg-white/5 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 rounded-xl bg-neon-cyan text-oled-black font-black uppercase text-xs shadow-neon-cyan hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all"
                  >
                    Créer Directive
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}

function TaskItem({ task, onToggle, onDelete }: { task: Task, onToggle: () => void, onDelete: () => void }) {
  const priorityColors = {
    low: 'text-gray-400 border-gray-400/30',
    medium: 'text-neon-cyan border-neon-cyan/30',
    high: 'text-neon-magenta border-neon-magenta/30'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative p-4 rounded-2xl border transition-all duration-300 ${task.completed
          ? 'bg-white/5 border-white/10 opacity-60'
          : 'bg-glass-dark border-white/10 hover:border-neon-cyan/40 hover:shadow-[0_0_15px_rgba(0,243,255,0.05)]'
        }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={onToggle}
          className={`mt-1 transition-colors ${task.completed ? 'text-neon-cyan' : 'text-gray-600 hover:text-white'}`}
        >
          {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className={`font-bold transition-all ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
              {task.title}
            </h3>
            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className={`text-xs mb-3 ${task.completed ? 'text-gray-600' : 'text-gray-400'}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 uppercase">
              <Clock size={12} className="text-neon-cyan/70" />
              <span>{task.actualPomodoros || 0} / {task.estimatedPomodoros} Pomodoros</span>
            </div>

            {!task.completed && task.actualPomodoros >= task.estimatedPomodoros && (
              <div className="flex items-center gap-1 text-[10px] font-black text-neon-orange uppercase animate-pulse">
                <AlertCircle size={12} /> Objectif Atteint
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-500 transition-all"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Progress Bar (Subtle) */}
      {!task.completed && (
        <div className="absolute bottom-0 left-0 h-[2px] bg-white/5 w-full rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (task.actualPomodoros / task.estimatedPomodoros) * 100)}%` }}
            className="h-full bg-neon-cyan shadow-[0_0_8px_#00f3ff]"
          />
        </div>
      )}
    </motion.div>
  );
}
