export const MAX_LEVEL = 50;

// Simple linear or exponential growth for Neo Tokyo progression
export const getXpForLevel = (level: number): number => {
  if (level <= 1) return 0;
  // Example: Level 2 needs 1000, Level 50 needs ~2.4M
  return Math.floor(1000 * Math.pow(level - 1, 1.5));
};

export const getLevelFromXp = (xp: number): number => {
  let level = 1;
  while (level < MAX_LEVEL && xp >= getXpForLevel(level + 1)) {
    level++;
  }
  return level;
};
