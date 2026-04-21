export interface TalentDef {
  id: string;
  name: string;
  branch: 'focus' | 'discipline' | 'power';
  cost: number;
  description: string;
}

export const TALENTS: TalentDef[] = [
  { id: 'focus_t1', name: 'Endurant', branch: 'focus', cost: 1, description: '+10% XP sessions > 60 min' },
  { id: 'focus_t2', name: 'Concentré', branch: 'focus', cost: 1, description: '-1 pénalité de pause par session' },
  { id: 'focus_t3', name: 'Ultra-Focus', branch: 'focus', cost: 2, description: '+20% XP sessions > 60 min' },
  
  { id: 'disc_t1', name: 'Matinal', branch: 'discipline', cost: 1, description: '×1.3 XP avant 9h' },
  { id: 'disc_t2', name: 'Gardien', branch: 'discipline', cost: 2, description: '1 gèle streak gratuit par mois' },
  { id: 'disc_t3', name: 'Rattrapage', branch: 'discipline', cost: 2, description: '2h le dimanche = +1 jour de streak' },
  
  { id: 'pow_t1', name: 'Berserker', branch: 'power', cost: 3, description: 'Actif = ×2 XP, abandon = -50 XP' },
  { id: 'pow_t2', name: 'Pause Gratuite', branch: 'power', cost: 2, description: '1 pause/jour supplémentaire' },
];

export interface ConsumableDef {
  id: string;
  name: string;
  price: number;
  effect: string;
  iconType: 'shield' | 'freeze' | 'reset' | 'slot';
}

export const CONSUMABLES: ConsumableDef[] = [
  { id: 'shield', name: 'Bouclier Streak', price: 200, effect: 'Sauve votre streak 1 jour', iconType: 'shield' },
  { id: 'freeze', name: 'Gèle Streak', price: 200, effect: 'Protection manuelle d\'un jour', iconType: 'freeze' },
  { id: 'reset_talents', name: 'Reset Talents', price: 500, effect: 'Redistribue les points', iconType: 'reset' },
  { id: 'preset_slot', name: '+1 Slot Preset', price: 300, effect: 'Dépasse la limite de presets', iconType: 'slot' },
];
