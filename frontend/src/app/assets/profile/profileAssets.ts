import type { SessionStatsInterface } from "../../interfaces/matchInterfaces";
import type {
  AchievementInterface,
  FetchInterface,
} from "../../interfaces/profileInterfaces";

export const fetchObject: FetchInterface = {
  status: "idle",
  message: "",
  payload: null,
};

export const GLOBAL_ACHIEVEMENTS: AchievementInterface[] = [
  {
    id: "first_blood",
    title: "Gutter Runner",
    description: "Win your first hand in the Shelter.",
    category: "EXPLORATION",
    isUnlocked: false,
    dateUnlocked: null,
    currentProgress: 0,
    targetValue: 1,
    rewardPlei: 100,
  },
  {
    id: "high_roller_1",
    title: "Pocket Change",
    description: "Accumulate 5,000 Plei total.",
    category: "WEALTH",
    isUnlocked: false,
    dateUnlocked: null,
    currentProgress: 0,
    targetValue: 5000,
    rewardPlei: 500,
  },
  {
    id: "bluff_master",
    title: "Ghost in the Machine",
    description: "Successfully bluff an NPC 10 times.",
    category: "STYLE",
    isUnlocked: false,
    dateUnlocked: null,
    currentProgress: 0,
    targetValue: 10,
    rewardPlei: 1000,
  },
];

export const INITIAL_SESSION_STATS: SessionStatsInterface = {
  handsPlayed: 0,
  handsWon: 0,
  handsLost: 0,
  handsTied: 0,
  currentWinStreak: 0,
  currentLossStreak: 0,
  longestWinStreak: 0,
  totalSessionProfit: 0,
  biggestPotWon: 0,
  biggestLoss: 0,
  totalBuyIn: 0,
  totalCashOut: 0,
  vpipCount: 0,
  pfrCount: 0,
  bluffsAttempted: 0,
  bluffsSucceeded: 0,
  showdownsReached: 0,
  showdownsWon: 0,
  startTime: new Date().toISOString(),
  endTime: null, // The "Neo Tokyo" start clock
  lastHandResult: null,
};
export const LEVEL_UP_REWARDS: Record<
  number,
  { message: string; perk?: string; unlockId?: string }
> = {
  2: {
    message:
      "Word on the street is you've got hands. The 'Neon-Alley-Club' is now taking your action.",
    perk: "Location Unlocked: Neon-Alley-Club",
    unlockId: "neon-alley-club",
  },
  3: {
    message:
      "A scout from the syndicate noticed your win streak. They left you a custom deck.",
    perk: "New Deck Style: 'Exploding Face'",
    unlockId: "explodingFace",
  },
  4: {
    message:
      "You're getting too big for the gutters. Time to see what the 'Low-Vault-Lounge' is hiding.",
    perk: "Location Unlocked: Low-Vault-Lounge",
    unlockId: "low-vault-lounge",
  },
  5: {
    message:
      "Middle Management. You now get a 10% discount on all 'Plei' top-ups.",
    perk: "Passive Perk: Efficient Exchange",
  },
  6: {
    message:
      "The high-rises are calling. The 'Holdem-Hotel' has a suite waiting for you.",
    perk: "Location Unlocked: Holdem-Hotel",
    unlockId: "holdem-hotel",
  },
  7: {
    message:
      "Your reputation precedes you. NPCs are now 15% more likely to fold to your bluffs.",
    perk: "Passive Perk: Intimidating Presence",
  },
  8: {
    message: "You've reached the Inner Circle. The 'Atrium' is now accessible.",
    perk: "Location Unlocked: Atrium",
    unlockId: "atrium",
  },
  9: {
    message:
      "The air is getting thin. Only one stop left before the top. 'Zenith' invites are rare.",
    perk: "Upcoming: The Final Ascent",
  },
  10: {
    message: "Welcome to the Zenith. You own these streets now.",
    perk: "New Deck Style: 'The Flying Cow' (Gold Edition)",
    unlockId: "theFlyingCow",
  },
};

export const xpMap = {
  two: 5,
  three: 20,
  four: 45,
  five: 80,
  six: 125,
  seven: 180,
  eight: 245,
  nine: 320,
  ten: 405,
  eleven: 500,
};

export const locationRewardsMap: Record<
  string,
  { xpBase: number; pleiBase: number }
> = {
  shelter: {
    xpBase: 20,
    pleiBase: 5,
  },
  halls: {
    xpBase: 50,
    pleiBase: 15,
  },
  neonAlley: {
    xpBase: 120,
    pleiBase: 40,
  },
};

export const MAX_LEVEL = 50;
export const BASE_XP = 100; // XP needed for Level 1 -> 2
export const EXPONENT = 1.5; // Controls how steep the curve is (1.5 is classic MMO)

/**
 * Calculates total XP required to reach a specific level.
 * Formula: BaseXP * (Level ^ Exponent)
 */
export const getXpRequiredForLevel = (level: number): number => {
  if (level >= MAX_LEVEL) return 999_999_999; // The "Endless" cap

  // This creates a curve: Level 2 ≈ 282, Level 10 ≈ 3,162, Level 49 ≈ 34,300
  return Math.floor(BASE_XP * Math.pow(level, EXPONENT));
};
