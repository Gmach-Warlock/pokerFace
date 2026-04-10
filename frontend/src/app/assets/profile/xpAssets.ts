export const getXpRequiredForLevel = (level: number): number => {
  if (level <= 1) return 0;

  // Example: Level 2 = 1000, and it grows quadratically
  // Formula: 1000 * (level - 1)^1.5 (rounded to nearest 50)
  const baseXP = 1000;
  const scalingFactor = Math.pow(level - 1, 1.5);

  return Math.ceil((baseXP * scalingFactor) / 50) * 50;
};

const MAX_LEVEL_SUPPORTED = 50;

// 1. Fill the Array (Great for logic/loops)
export const LEVEL_THRESHOLDS: number[] = Array.from(
  { length: MAX_LEVEL_SUPPORTED },
  (_, i) => getXpRequiredForLevel(i + 1),
);

// 2. Fill the Map Object (Great for keyed lookup: xpMap.level2)
export const xpMap = LEVEL_THRESHOLDS.reduce(
  (acc, xp, index) => {
    acc[`level${index + 1}`] = xp;
    return acc;
  },
  {} as Record<string, number>,
);

// 3. Fill the Object Array (Great for rendering a 'Level Rewards' list)
export const levelDetails = LEVEL_THRESHOLDS.map((xp, i) => ({
  level: i + 1,
  totalXpRequired: xp,
  label: `Level ${i + 1}`,
}));
