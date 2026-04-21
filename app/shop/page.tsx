"use client";

import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Coins, Star, Shield, Snowflake, RotateCcw, Plus, Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";
import { TALENTS, CONSUMABLES } from "@/lib/gamification/shopData";
import { db } from "@/lib/db/dexie";

const ICONS = {
  shield: Shield,
  freeze: Snowflake,
  reset: RotateCcw,
  slot: Plus,
  backpack: Shield, // Utiliser Shield ou un autre icon pour le sac
};

export default function ShopPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'talents' | 'shop' | 'inventory'>('talents');

  if (!user) {
    return <div className="min-h-screen bg-oled-black flex items-center justify-center"><div className="animate-pulse text-neon-cyan">Chargement...</div></div>;
  }

  const handleBuyConsumable = async (itemId: string, price: number) => {
    if (user.coins >= price) {
      const currentInventory = user.inventory || {};
      const newQuantity = (currentInventory[itemId] || 0) + 1;
      
      await db.user.update("me", { 
        coins: user.coins - price,
        inventory: { ...currentInventory, [itemId]: newQuantity }
      });
      alert(`Achat de ${itemId} réussi !`);
    } else {
      alert("Pas assez de Pomocoins !");
    }
  };

  const handleUnlockTalent = async (talentId: string, cost: number) => {
    if (user.talents.includes(talentId)) return; // Déjà débloqué
    if (user.talentPoints >= cost) {
      await db.user.update("me", { 
        talentPoints: user.talentPoints - cost,
        talents: [...user.talents, talentId]
      });
    } else {
      alert("Pas assez de points de talent !");
    }
  };

  return (
    <main className="min-h-screen pb-40 bg-oled-black bg-grid-cyber relative overflow-x-hidden p-6 pt-12">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="w-full flex justify-between items-center mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-white text-glow-cyan">Hangar</h1>
          <p className="text-gray-400 text-sm">Améliorations & Boutique</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-glass-dark border border-yellow-400/30 px-3 py-1 rounded-full">
            <Coins className="text-yellow-400" size={16} />
            <span className="text-white font-bold">{user.coins}</span>
          </div>
          <div className="flex items-center gap-2 bg-glass-dark border border-neon-cyan/30 px-3 py-1 rounded-full">
            <Star className="text-neon-cyan" size={16} />
            <span className="text-white font-bold">{user.talentPoints}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-full bg-glass-dark border border-white/10 rounded-xl p-1 mb-6 relative z-10">
        <button 
          onClick={() => setActiveTab('talents')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-lg transition-colors ${activeTab === 'talents' ? 'bg-neon-cyan text-oled-black shadow-[0_0_15px_#00f3ff]' : 'text-gray-400 hover:text-white'}`}
        >
          Arbre de Talents
        </button>
        <button 
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${activeTab === 'shop' ? 'bg-neon-magenta text-white shadow-[0_0_15px_#ff00ff]' : 'text-gray-400 hover:text-white'}`}
        >
          Consommables
        </button>
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${activeTab === 'inventory' ? 'bg-yellow-400 text-oled-black shadow-[0_0_15px_#facc15]' : 'text-gray-400 hover:text-white'}`}
        >
          Sac à dos
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {activeTab === 'talents' ? (
          <div className="flex flex-col gap-8">
            {(['focus', 'discipline', 'power'] as const).map(branch => (
              <div key={branch}>
                <h3 className="text-neon-orange uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                  Branche {branch}
                  <div className="flex-1 h-[1px] bg-neon-orange/30"></div>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {TALENTS.filter(t => t.branch === branch).map(talent => {
                    const isUnlocked = user.talents.includes(talent.id);
                    const canAfford = user.talentPoints >= talent.cost;
                    
                    return (
                      <motion.div 
                        key={talent.id}
                        whileTap={!isUnlocked && canAfford ? { scale: 0.98 } : {}}
                        onClick={() => handleUnlockTalent(talent.id, talent.cost)}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                          isUnlocked 
                            ? 'bg-neon-cyan/10 border-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.2)]' 
                            : canAfford 
                              ? 'bg-glass-dark border-white/20 cursor-pointer hover:border-neon-cyan/50' 
                              : 'bg-glass-dark border-white/5 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {isUnlocked ? <Unlock size={14} className="text-neon-cyan" /> : <Lock size={14} className="text-gray-500" />}
                            <h4 className={`font-bold ${isUnlocked ? 'text-neon-cyan' : 'text-white'}`}>{talent.name}</h4>
                          </div>
                          <p className="text-xs text-gray-400">{talent.description}</p>
                        </div>
                        <div className={`text-xs font-black px-3 py-1 rounded-full ${isUnlocked ? 'bg-neon-cyan text-oled-black' : 'bg-white/10 text-white'}`}>
                          {isUnlocked ? 'ACQUIS' : `${talent.cost} PT`}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'shop' ? (
          <div className="grid grid-cols-2 gap-4">
            {CONSUMABLES.map(item => {
              const Icon = ICONS[item.iconType as keyof typeof ICONS] || Shield;
              const canAfford = user.coins >= item.price;
              
              return (
                <div key={item.id} className="bg-glass-dark border border-neon-magenta/30 p-4 rounded-2xl flex flex-col items-center text-center shadow-[0_0_10px_rgba(255,0,255,0.05)]">
                  <div className="w-12 h-12 rounded-full bg-neon-magenta/20 flex items-center justify-center mb-3 text-neon-magenta drop-shadow-[0_0_8px_#ff00ff]">
                    <Icon size={24} />
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1">{item.name}</h4>
                  <p className="text-neon-magenta/70 text-[10px] uppercase tracking-widest mb-4 flex-1">{item.effect}</p>
                  
                  <motion.button 
                    whileHover={canAfford ? { scale: 1.05 } : {}}
                    whileTap={canAfford ? { scale: 0.95 } : {}}
                    onClick={() => handleBuyConsumable(item.id, item.price)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-1 transition-colors ${
                      canAfford 
                        ? 'bg-yellow-400 text-black shadow-[0_0_10px_#facc15]' 
                        : 'bg-white/10 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {item.price} <Coins size={14} />
                  </motion.button>
                </div>
              );
            })}
          </div>
        ) : (
          <InventoryTab />
        )}
      </div>
    </main>
  );
}

function InventoryTab() {
  const { user } = useUser();
  const { handleUseItem } = useInventory();
  const inventory = user?.inventory || {};
  const items = Object.entries(inventory).filter(([, qty]) => qty > 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-glass-dark border border-dashed border-white/10 rounded-3xl">
        <Shield size={48} className="text-gray-600 mb-4 opacity-20" />
        <p className="text-gray-500 uppercase text-[10px] font-black tracking-widest">Votre sac à dos est vide</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map(([id, qty]) => {
        const itemDef = CONSUMABLES.find(c => c.id === id);
        if (!itemDef) return null;
        const Icon = ICONS[itemDef.iconType as keyof typeof ICONS] || Shield;

        return (
          <div key={id} className="bg-glass-dark border border-white/10 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-neon-cyan">
                <Icon size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">{itemDef.name}</h4>
                <p className="text-[9px] text-gray-400 uppercase">{itemDef.effect}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-[10px] text-yellow-400 font-black">x{qty}</span>
              <button 
                onClick={() => handleUseItem(id)}
                className="px-4 py-1 bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan text-[10px] font-black uppercase rounded hover:bg-neon-cyan hover:text-oled-black transition-all"
              >
                Utiliser
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { useInventory } from "@/hooks/useInventory";
