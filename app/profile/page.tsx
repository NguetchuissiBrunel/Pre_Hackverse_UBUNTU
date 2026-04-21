"use client";

import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User, LogOut, Trash2, Award, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db/dexie";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const handleResetLocal = async () => {
    if (confirm("Voulez-vous vraiment réinitialiser vos données locales ? Cette action est irréversible (si non synchronisée).")) {
      await db.user.clear();
      await db.sessions.clear();
      window.location.reload();
    }
  };

  return (
    <main className="min-h-screen pb-40 bg-oled-black bg-grid-cyber p-6 pt-12 relative overflow-x-hidden text-white">
      
      {/* Header */}
      <div className="flex flex-col items-center mb-10 relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-neon-cyan/20 flex items-center justify-center text-neon-cyan mb-4 shadow-[0_0_30px_rgba(0,243,255,0.3)] border border-neon-cyan/30">
          <User size={40} />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-widest text-center leading-none">
          {user?.id === 'me' ? "Agent Anonyme" : "Profil Authentifié"}
        </h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] mt-2">ID_SESS: {user?.id?.slice(0, 8)}</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto relative z-10">
        
        {/* Tier Info */}
        <div className="bg-glass-dark border border-white/5 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Award size={20} className="text-yellow-400" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Rang de la Grille</h2>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between text-xs font-bold uppercase">
               <span className="text-gray-400">Titre Actuel</span>
               <span className="text-neon-cyan">Cyber Samouraï</span>
             </div>
             <div className="flex justify-between text-xs font-bold uppercase">
               <span className="text-gray-400">Statut Synchro</span>
               <span className="text-green-500">Connecté</span>
             </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-glass-dark border border-red-900/20 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6 text-red-500">
            <ShieldCheck size={20} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Zone Critique</h2>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <LogOut size={16} /> Déconnexion
            </button>
            <button 
              onClick={handleResetLocal}
              className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
            >
              <Trash2 size={16} /> Réinitialiser les données
            </button>
          </div>
          <p className="mt-4 text-[8px] text-gray-500 uppercase text-center tracking-tighter">
            L&apos;effacement des données n&apos;affecte pas votre profil Supabase.
          </p>
        </div>
      </div>

    </main>
  );
}
