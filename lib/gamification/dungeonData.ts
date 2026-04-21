export interface Dungeon {
  id: string;
  name: string;
  description: string;
  bgClass: string;
  ambiance: 'rain' | 'fire' | 'cafe' | 'none';
  accentColor: string;
  unlockedLevel: number;
}

export const DUNGEONS: Dungeon[] = [
  {
    id: 'neon_city',
    name: 'Néon City',
    description: 'La métropole du futur. Parfait pour le sprint urbain.',
    bgClass: 'bg-grid-cyber',
    ambiance: 'cafe',
    accentColor: 'neon-cyan',
    unlockedLevel: 1
  },
  {
    id: 'cyber_forest',
    name: 'Forêt Cyber',
    description: 'Brumes électriques et arbres bioluminescents. Idéal pour le Deep Work.',
    bgClass: 'bg-grid-forest',
    ambiance: 'rain',
    accentColor: 'green-400',
    unlockedLevel: 5
  },
  {
    id: 'orbital_station',
    name: 'Station Orbitale',
    description: 'Le vide spatial. Concentration absolue pour les maîtres.',
    bgClass: 'bg-grid-space',
    ambiance: 'none',
    accentColor: 'neon-magenta',
    unlockedLevel: 15
  },
  {
    id: 'lava_core',
    name: 'Cœur de Magma',
    description: 'L\'intensité pure. Le grind ultime sous une chaleur de plomb.',
    bgClass: 'bg-grid-lava',
    ambiance: 'fire',
    accentColor: 'neon-orange',
    unlockedLevel: 25
  }
];
