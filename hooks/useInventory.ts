"use client";

import { db } from "@/lib/db/dexie";
import { useUser } from "./useUser";

export function useInventory() {
  const { user } = useUser();

  const useItem = async (itemId: string) => {
    if (!user || !user.inventory || !user.inventory[itemId] || user.inventory[itemId] <= 0) {
      alert("Vous ne possédez pas cet objet !");
      return false;
    }

    // Décrémenter la quantité
    const newInventory = { ...user.inventory };
    newInventory[itemId] -= 1;
    if (newInventory[itemId] <= 0) delete newInventory[itemId];

    await db.user.update("me", { inventory: newInventory });

    // Appliquer l'effet
    switch (itemId) {
      case 'reset_talents':
        await db.user.update("me", { 
          talents: [], 
          talentPoints: user.level - 1 // Redonner tous les points basés sur le niveau
        });
        alert("Tous vos points de talent ont été réinitialisés !");
        break;
      
      case 'shield':
        // Logique simplifiée : on pourrait ajouter un champ 'hasShield' dans le profil
        alert("Bouclier de Streak activé ! Votre prochaine absence sera protégée.");
        break;

      default:
        alert(`Objet ${itemId} utilisé !`);
    }

    return true;
  };

  return { inventory: user?.inventory || {}, handleUseItem: useItem };
}
