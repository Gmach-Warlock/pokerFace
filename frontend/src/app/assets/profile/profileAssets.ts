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

export const INITIAL_LIFETIME_STATS = {
  matches: {
    hand: {
      handsPlayed: 0,
      handsWon: 0,
      handsLost: 0,
      handsTied: 0,
    },
    streak: {
      currentWinStreak: 0,
      currentLossStreak: 0,
      longestWinStreak: 0,
    },
    monetary: {
      totalProfit: 0,
      biggestPotWon: 0,
      biggestLoss: 0,
      totalBuyIn: 0,
      totalCashOut: 0,
      allTimeHighBalance: 0,
      totalRakePaid: 0, // If your game has a "house" fee
      biggestSuckout: 0,
    },
    various: {
      vpipCount: 0,
      pfrCount: 0,
      bluffsAttempted: 0,
      bluffsSucceeded: 0,
      showdownsReached: 0,
      showdownsWon: 0,
    },
    log: {
      startTime: new Date().toISOString(),
      endTime: null,
      lastHandResult: null,
    },
  },
  opponents: {
    opponentsPlayed: {
      classy: [],
      classic: [],
      gritty: [],
      modern: [],
      pro: [],
    },
    totalPlayed: 0,
    opponentsBeaten: {
      classy: [],
      classic: [],
      gritty: [],
      modern: [],
      pro: [],
    },
    totalBeaten: 0,
  },
  achievements: {
    unlocked: [],

    milestones: {
      highestLevelReached: 1,
      totalXpEarned: 0,
    },
    processedTiers: {
      winCount: 0,
      profitMilestone: 0,
    },
    rarityCounts: {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    },
    lastUnlockedAt: null,
  },
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

export const locationRewardsMap: Record<
  string,
  { xpBase: number; pleiBase: number }
> = {
  shelter: {
    xpBase: 50,
    pleiBase: 5,
  },
  lowVaultLounge: {
    xpBase: 100,
    pleiBase: 10,
  },
  neonAlleyClub: {
    xpBase: 250,
    pleiBase: 25,
  },
  halls: {
    xpBase: 550,
    pleiBase: 15,
  },
  compound: {
    xpBase: 150,
    pleiBase: 20,
  },
  holdemHotel: {
    xpBase: 300,
    pleiBase: 30,
  },
  drawDen: {
    xpBase: 200,
    pleiBase: 20,
  },
  studStay: {
    xpBase: 500,
    pleiBase: 10,
  },
  atrium: {
    xpBase: 1000,
    pleiBase: 50,
  },
  zenith: {
    xpBase: 5000,
    pleiBase: 100,
  },
};
