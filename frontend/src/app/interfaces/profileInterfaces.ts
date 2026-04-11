import type {
  DeckStyleType,
  DifficultyType,
  LastResultType,
} from "../types/matchTypes";
import type { MatchLocationType } from "../types/worldMapTypes";
import type { AchievementCategory } from "../types/profileTypes";
import type { SessionStatsInterface, PlayerInterface } from "./matchInterfaces";
import type { FetchStatusType } from "../types/profileTypes";
import type {
  ClassicNameType,
  ClassyNameType,
  GrittyNameType,
  ModernNameType,
  ProNameType,
} from "../types/villainsTypes";

export interface AchievementInterface {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  isUnlocked: boolean;
  dateUnlocked: string | null;
  currentProgress: number;
  targetValue: number;
  rewardPlei: number;
  icon?: string; // e.g., "🏆" or a path to a SVG
}
export interface AuthorizeState {
  meta: {
    authorized: boolean;
    id: string;
    username: string;
    email: string;
  };
  playerData: PlayerProfileInterface;
}
export interface FetchInterface {
  status: FetchStatusType;
  message: string;
  payload: null | object;
}

export interface LocationProgress {
  starsEarned: number; // 0-3 stars per location
  highestDifficultyCleared: DifficultyType;
  totalTimeSpent: number;
  specialObjectivesCompleted: string[]; // IDs of hidden tasks
  isDiscovered: boolean;
}

export interface PlayerProfileInterface {
  level: number;
  xp: number;
  nextLevel: number;
  money: number;
  plei: number;
  availableLocations: MatchLocationType[];
  availableDecks: DeckStyleType[] | null;
  locationsVisited: MatchLocationType[];
  locationsMastered: MatchLocationType[];
  currentDeckChoice?: DeckStyleType | null;
  isSpecial?: boolean;
  stats: {
    lifetime: SessionStatsInterface;
  };
  achievements?: AchievementInterface[];
  rivalries: Record<string, RivalryStats>; // Key is the NPC ID (e.g., "villain-001")
  worldProgress: Partial<Record<MatchLocationType, LocationProgress>>;
}

export interface ProfileInterface {
  meta: {
    authorized: boolean;
    id: string;
    username: string;
    email: string;
    password: string;
  };
  playerData: PlayerInterface;
}

export interface RivalryStats {
  timesEncountered: number;
  timesBeaten: number;
  timesLost: number;
  currentWinStreak: number;
  highestPotTaken: number;
  lastEncounterDate: string;
}

export interface LifetimeStatsInterface {
  matches: {
    hand: {
      handsPlayed: number;
      handsWon: number;
      handsLost: number;
      handsTied: number;
    };
    streak: {
      currentWinStreak: number;
      currentLossStreak: number;
      longestWinStreak: number;
    };
    monetary: {
      totalProfit: number;
      biggestPotWon: number;
      biggestLoss: number;
      totalBuyIn: number;
      totalCashOut: number;
      allTimeHighBalance: number;
      totalRakePaid: number;
      biggestSuckout: number; // Largest pot won when starting with < 20% equity (if you track that)
    };
    various: {
      vpipCount: number; // Voluntarily Put In Pot
      pfrCount: number; // Pre-Flop Raise
      bluffsAttempted: number;
      bluffsSucceeded: number;
      showdownsReached: number;
      showdownsWon: number;
    };
    log: {
      startTime: string;
      endTime: string | null;
      lastHandResult: LastResultType;
    };
  };
  opponents: {
    opponentsPlayed: {
      classy: ClassyNameType[];
      classic: ClassicNameType[];
      gritty: GrittyNameType[];
      modern: ModernNameType[];
      pro: ProNameType[];
    };
    totalPlayed: number;
    opponentsBeaten: {
      classy: ClassyNameType[];
      classic: ClassicNameType[];
      gritty: GrittyNameType[];
      modern: ModernNameType[];
      pro: ProNameType[];
    };
    totalBeaten: number;
    history?: {
      [opponentName: string]: {
        timesEncountered: number;
        timesBeaten: number;
        netProfit: number; // Positive if you took their money, negative if they took yours
      };
    };
  };
  achievements: {
    unlocked: string[]; // IDs of completed achievements
    milestones: {
      highestLevelReached: number;
      totalXpEarned: number;
    };
    processedTiers: {
      winCount: number;
      profitMilestone: number;
    };
    rarityCounts: {
      common: number;
      rare: number;
      epic: number;
      legendary: number;
    };
    lastUnlockedAt: string | null;
  };
}

/* export interface SessionStatsInterface {
  handsPlayed: number;
  handsWon: number;
  handsLost: number;
  handsTied: number;

  currentWinStreak: number;
  currentLossStreak: number;
  longestWinStreak: number;

  totalSessionProfit: number;
  biggestPotWon: number;
  biggestLoss: number;
  totalBuyIn: number;
  totalCashOut: number;

  vpipCount: number; // Voluntarily Put In Pot
  pfrCount: number; // Pre-Flop Raise
  bluffsAttempted: number;
  bluffsSucceeded: number;
  showdownsReached: number;
  showdownsWon: number;

  startTime: string;
  endTime: string | null;
  lastHandResult: LastResultType;
} */
