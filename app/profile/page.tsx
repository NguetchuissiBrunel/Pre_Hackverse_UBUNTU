"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useTasks } from "@/hooks/useTasks";
import { CheckCircle2, User, LogOut, Shield, Award, Calendar, Mail } from "lucide-react";
import { db } from "@/lib/db/dexie";

export default function ProfilePage() {
  const { user } = useUser();
  const { tasks } = useTasks();
  const [session, setSession] = useState<{ user?: { email?: string; user_metadata?: { username?: string } } } | null>(null);
  
  const completedTasks = tasks.filter(t => t.completed).length;

  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const handleResetData = async () => {
    if (confirm("Voulez-vous vraiment supprimer toutes vos données locales ? Cette action est irréversible.")) {
      await db.delete();
      window.location.reload();
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen pb-40 bg-oled-black bg-grid-cyber p-6 pt-12 relative overflow-x-hidden flex flex-col items-center">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-neon-cyan/10 to-transparent pointer-events-none" />

      {/* Profile Header */}
      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-3xl bg-neon-cyan/20 border-2 border-neon-cyan flex items-center justify-center text-neon-cyan shadow-[0_0_20px_#00f3ff] mb-4">
          <User size={48} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-widest">{session?.user?.user_metadata?.username || "Héros_Local"}</h2>
        <p className="text-neon-cyan/70 text-xs font-bold uppercase tracking-widest mt-1">C&apos;est vous !</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm relative z-10 mb-8">
        <div className="bg-glass-dark border border-white/5 p-4 rounded-2xl flex flex-col items-center">
          <Award className="text-yellow-400 mb-1" size={20} />
          <span className="text-[8px] text-gray-500 uppercase font-black">Niveau</span>
          <span className="text-xl font-black text-white">{user.level}</span>
        </div>
        <div className="bg-glass-dark border border-white/5 p-4 rounded-2xl flex flex-col items-center">
          <Calendar className="text-neon-magenta mb-1" size={20} />
          <span className="text-[8px] text-gray-500 uppercase font-black">Série</span>
          <span className="text-xl font-black text-white">{user.streak}J</span>
        </div>
        <div className="bg-glass-dark border border-white/5 p-4 rounded-2xl flex flex-col items-center">
          <CheckCircle2 className="text-neon-cyan mb-1" size={20} />
          <span className="text-[8px] text-gray-500 uppercase font-black">Tâches</span>
          <span className="text-xl font-black text-white">{completedTasks}</span>
        </div>
      </div>

      {/* Info List */}
      <div className="w-full max-w-sm flex flex-col gap-3 relative z-10">
        <div className="bg-glass-dark border border-white/5 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-gray-400" />
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-500 uppercase font-black">Email lié</span>
              <span className="text-xs text-white">{session?.user?.email || "Non connecté"}</span>
            </div>
          </div>
        </div>

        <div className="bg-glass-dark border border-white/5 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-neon-cyan" />
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-500 uppercase font-black">Mode de jeu</span>
              <span className="text-xs text-white">Hybride (Cloud + Local)</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="w-full max-w-sm mt-12 pt-6 border-t border-white/5 relative z-10 space-y-4">
        {session ? (
          <button 
            onClick={handleLogout}
            className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/10 hover:border-red-500/50 transition-all"
          >
            <LogOut size={16} /> Se déconnecter
          </button>
        ) : (
          <button 
            onClick={() => router.push("/auth")}
            className="w-full py-3 bg-neon-cyan text-oled-black rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
          >
            Se connecter au Cloud
          </button>
        )}

        <button 
          onClick={handleResetData}
          className="w-full py-3 text-red-500/50 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors"
        >
          Réinitialiser le profil local
        </button>
      </div>

    </main>
  );
}
