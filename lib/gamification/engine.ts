export const TITLES = [
  { level: 1, name: "Disciple", color: "text-gray-400" },
  { level: 5, name: "Guerrier", color: "text-green-400" },
  { level: 10, name: "Vétéran", color: "text-blue-400" },
  { level: 15, name: "Maître", color: "text-purple-400" },
  { level: 20, name: "Expert", color: "text-neon-magenta" },
  { level: 30, name: "Légende", color: "text-neon-cyan" },
  { level: 50, name: "Transcendé", color: "text-neon-orange" },
  { level: 100, name: "Dieu du Focus", color: "text-yellow-400 text-glow-orange" },
];

export function getXpRequiredForNextLevel(currentLevel: number): number {
  return Math.floor(100 * Math.pow(currentLevel, 1.3));
}

/**
 * Calcule le niveau en fonction de l'XP total.
 * @param totalXp XP accumulée
 * @returns Le niveau et les détails pour la barre de progression
 */
export function calculateLevelFromXp(totalXp: number) {
  let level = 1;
  let remainingXp = totalXp;
  let requiredForNext = getXpRequiredForNextLevel(level);

  while (remainingXp >= requiredForNext) {
    remainingXp -= requiredForNext;
    level++;
    requiredForNext = getXpRequiredForNextLevel(level);
  }

  // Find title
  const currentTitle = [...TITLES].reverse().find(t => level >= t.level) || TITLES[0];

  return {
    level,
    title: currentTitle.name,
    titleColor: currentTitle.color,
    currentLevelXp: remainingXp,
    requiredForNextLevel: requiredForNext,
    progressPercentage: Math.max(0, Math.min(100, (remainingXp / requiredForNext) * 100)),
  };
}

export function getCurrentTitle(level: number) {
  return [...TITLES].reverse().find(t => level >= t.level) || TITLES[0];
}
