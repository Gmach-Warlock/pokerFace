import type { MatchLocationType } from "../../types/worldMapTypes";

export const getXpRequiredForLevel = (level: number): number => {
  if (level <= 1) return 0;

  const baseXP = 1000;
  const scalingFactor = Math.pow(level - 1, 1.5);

  return Math.ceil((baseXP * scalingFactor) / 50) * 50;
};

const MAX_LEVEL_SUPPORTED = 50;

export const LEVEL_THRESHOLDS: number[] = Array.from(
  { length: MAX_LEVEL_SUPPORTED },
  (_, i) => getXpRequiredForLevel(i + 1),
);

export const xpMap = LEVEL_THRESHOLDS.reduce(
  (acc, xp, index) => {
    acc[`level${index + 1}`] = xp;
    return acc;
  },
  {} as Record<string, number>,
);

export const levelDetails = LEVEL_THRESHOLDS.map((xp, i) => ({
  level: i + 1,
  totalXpRequired: xp,
  label: `Level ${i + 1}`,
}));

export const areaXpGuide: Record<MatchLocationType, number> = {
  none: 0,
  shelter: 100,
  "low-vault-lounge": 200,
  "neon-alley-club": 300,
  halls: 400,
  compound: 500,
  "holdem-hotel": 750,
  "draw-den": 750,
  "stud-stay": 750,
  atrium: 1000,
  zenith: 5000,
};
