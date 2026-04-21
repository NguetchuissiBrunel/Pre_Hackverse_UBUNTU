"use client";

import { useUser } from "@/hooks/useUser";
import { BarChart2, TrendingUp, Calendar, Zap } from "lucide-react";
import HeatMapDisplay from "@/components/HeatMapDisplay";

export default function StatsPage() {
  const { user } = useUser();

  return (
    <main className="min-h-screen pb-40 bg-oled-black bg-grid-cyber p-6 pt-12 relative overflow-x-hidden">
      
      {/* Header */}
      <div className="flex flex-col items-center mb-10 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-neon-magenta/20 flex items-center justify-center text-neon-magenta mb-4 shadow-[0_0_20px_rgba(255,0,255,0.3)]">
          <BarChart2 size={32} />
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-widest text-center leading-none">
          Analyses de Données
        </h1>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest text-center mt-2">Archives des Sessions de Combat</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 relative z-10 max-w-md mx-auto">
        <StatCard 
          label="Total XP" 
          value={user?.xp || 0} 
          icon={<Zap size={18} className="text-yellow-400" />} 
          color="neon-cyan"
        />
        <StatCard 
          label="Série Actuelle" 
          value={`${user?.streak || 0} Jours`} 
          icon={<TrendingUp size={18} className="text-neon-cyan" />} 
          color="neon-magenta"
        />
      </div>

      {/* Activity Heatmap */}
      <div className="bg-glass-dark border border-white/5 p-6 rounded-3xl relative z-10 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Calendar size={20} className="text-neon-cyan" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Intensité du Focus (90 Jours)</h2>
        </div>
        <HeatMapDisplay />
      </div>

    </main>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: string | number, icon: React.ReactNode, color: string }) {
  return (
    <div className={`bg-glass-dark border border-white/5 p-5 rounded-3xl group hover:border-${color}/50 transition-all shadow-xl`}>
      <div className="flex items-center justify-between mb-3 text-gray-500">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
    </div>
  );
}
