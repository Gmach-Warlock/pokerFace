import type {
  AchievementCategory,
  BettingActionType,
  CardValueType,
  CardSideType,
  CardSuitType,
  ContestantType,
  CurrentLocationType,
  ChipColorType,
  ChipIconType,
  CurrentSituationType,
  DeckNumberType,
  DeckStyleType,
  DifficultyType,
  FetchStatusType,
  GameDisplayType,
  GamePhaseType,
  HandType,
  LastResultType,
  PlayerType,
  PokerChoiceType,
  MatchLocationType,
  MatchType,
  NumberOfOpponentsType,
} from "../types";

// interfaces

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
export interface BettingInterface {
  currentPot?: number;
  heroMoney?: number;
  onConfirm: (amount: number, type: BettingActionType) => void;
  currentTableBet?: number;
  currentPlayerBet?: number;
}
export interface ButtonPropsInterface {
  label: string;
  isConfirming?: boolean;
}

export interface CardInterface {
  value: CardValueType;
  suit: CardSuitType;
  side: CardSideType;
  currentLocation: CurrentLocationType;
  isDiscarded: boolean;
  deckDesign: string;
}
export interface ChipInterface {
  color: ChipColorType;
  icon: ChipIconType;
  currentLocation: CurrentLocationType;
}
export interface ChipMapInterface {
  white: number;
  red: number;
  blue: number;
  green: number;
  black: number;
}

export interface DealCardPayload {
  target: ContestantType;
  side: CardSideType;
  opponentIndex?: number;
}
export interface DialogueInterface {
  gritty: string[];
  classic: string[];
  modern: string[];
  classy: string[];
  pro: string[];
}

export interface EvaluatedHandInterface {
  value: number;
  label: string;
  rankValue: number;
  strength: string;
}
export interface FetchInterface {
  status: FetchStatusType;
  message: string;
  payload: null | object;
}

export interface GameInterface {
  isPlaying: boolean;
  currentlyDisplayed: GameDisplayType;
  currentMatch: {
    numberOfOpponents: NumberOfOpponentsType;
    deckStyle: DeckStyleType;
    difficultyLevel: DifficultyType;
    matchLocation: MatchLocationType;
    matchType: MatchType;
    numberOfDecks: DeckNumberType;
    players: PlayerInterface[];
    dealersHand: CardInterface[];
    deck: CardInterface[];
    pot: number;
    currentBetOnTable: number;
    lastRaiserId: string | null;
    activePlayerIndex: number;
    currentPhase: GamePhaseInterface;
    winnerId?: string;
    winningHand?: string;
    lastWinAmount?: number;
    isGameOver?: boolean;
    handHistory?: {
      playerId: string;
      finalHandName: string;
      wasBluff: boolean;
    }[];
    rewards?: {
      xp: number;
      plei: number;
      bonuses: string[];
      isFirstMatch?: boolean;
      isFirstWin?: boolean;
      isLevelUp?: boolean;
    };
  };
  isMatchStarted: boolean;
}
export interface GamePayloadInterface {
  numberOfOpponents: NumberOfOpponentsType;
  levelOfDifficulty: DifficultyType;
  matchLocation: MatchLocationType;
  matchType: MatchType;
  numberOfDecks: DeckNumberType;
  deckStyle: DeckStyleType;
  hero: PlayerInterface;
}
export interface GamePhaseInterface {
  type: MatchType;
  phase: GamePhaseType;
}
export interface HandInterface {
  matchType: MatchType;
  cards: CardInterface[];
  currentLocation: CurrentLocationType;
  hand: HandType;
  isTitle?: boolean;
}
export interface HandResultInterface {
  playerId: string;
  handRank: number;
  handLabel: string;
  winningCards: CardInterface[];
  kickers: CardInterface[];
}
export interface LocationDetailsInterface {
  stats: SessionStatsInterface;
  bossDefeated: boolean;
  timesBossEncountered: number;
  unlockedLocalItems: string[]; // e.g., ["neon-deck", "high-roller-avatar"]
  rank: number; // 0 to 5 "stars" for that area
}
export interface MatchMapInterface {
  shelter: ["gritty"];
  "low-vault-lounge": ["gritty", "modern"];
  "neon-alley-club": ["gritty", "modern", "classy"];
  halls: ["modern", "classic"];
  compound: ["modern", "pro", "classy"];
  "holdem-hotel": ["pro", "modern", "classy"];
  "draw-den": ["pro", "classic", "classy"];
  "stud-stay": ["pro", "classic", "classy"];
  atrium: ["classic", "pro", "modern", "classy"];
  zenith: ["classic", "gritty", "modern", "classy", "pro"];
}

export interface MatchInterface {
  numberOfOpponents: NumberOfOpponentsType;
  deckStyle: DeckStyleType;
  difficultyLevel: DifficultyType;
  matchLocation: MatchLocationType;
  matchType: MatchType;
  numberOfDecks: DeckNumberType;
  players: PlayerInterface[];
  dealersHand: CardInterface[];
  deck: CardInterface[];
  pot: number;
  currentBetOnTable: number;
  activePlayerIndex: number;
  lastRaiserId: string | null;
  actionMessage: string;
  messageId: number;
  currentPhase: GamePhaseInterface;
  winnerId?: string;
  winningHand?: string;
  lastWinAmount?: number;
  isGameOver?: boolean;
  handHistory?: {
    playerId: string;
    finalHandName: string;
    wasBluff: boolean;
  }[];
  rewards?: {
    xp: number;
    plei: number;
    bonuses: string[];
    isFirstMatch?: boolean;
    isFirstWin?: boolean;
    isLevelUp?: boolean;
    message?: string;
    perk?: string;
  };
  playingMatch: boolean;
}

export interface MatchSummaryInterface {
  matchId: string;
  location: MatchLocationType;
  gameType: MatchType;
  difficulty: DifficultyType;

  // Financials
  finalPot: number;
  earningsCash: number;
  earningsPlei: number;

  // Performance
  wasVictory: boolean;
  bestHandRank: HandType;
  opponentsKnockedOut: number;
  bluffsSucceeded: number;

  // Progression
  xpGained: number;
  newLevelReached: boolean;
  unlockedItemIds: string[];
}
export interface PhaseInstruction {
  cards: number | "variable";
  hero?: CardSideType;
  opp?: CardSideType;
  community?: CardSideType;
}
export interface PlayerInterface {
  id: string | null;
  name: string;
  type: PlayerType;
  difficulty?: DifficultyType;
  preferredDifficulty?: DifficultyType;
  availableDecks?: DeckStyleType[] | null;
  currentDeckChoice?: DeckStyleType | null;
  currentHand: CardInterface[];
  isDiscarding?: boolean;
  isFolded: boolean;
  money: number;
  chips: ChipMapInterface;
  currentBet: number;
  hasActed: boolean;
  lastAction?: PokerChoiceType;
  isAllin: boolean;
  sessionStats: SessionStatsInterface;
  profile?: {
    level: number;
    xp: number;
    nextLevel: number;
    availableLocations: string[];
    availableDecks: DeckStyleType[] | null;
    locationsVisited: MatchLocationType[];
    locationsMastered: MatchLocationType[];
    currentDeckChoice?: DeckStyleType | null;
    plei: number | null;
    isSpecial?: boolean;
    stats: {
      lifetime: SessionStatsInterface;
    };
  };
  npcTraits?: {
    general: {
      isTroll: boolean;
      bluffModifier: number;
      thinkTime: number;
      tiltLevel: number;
    };
    comments?: Partial<Record<CurrentSituationType, string[]>> | null;
  };
}
export interface SessionStatsInterface {
  handsPlayed: number;
  handsWon: number;
  handsLost: number;
  handsTied: number;

  currentWinStreak: number;
  currentLossStreak: number;
  longestWinStreak: number;

  totalSessionProfit: number; // Can be negative
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
}
export interface SituationalDialogueInterface {
  strongHand: DialogueInterface;
  weakHand: DialogueInterface;
  bluffing: DialogueInterface;
  gloating: DialogueInterface;
  sulking: DialogueInterface;
  neutral: DialogueInterface;
  nagging: DialogueInterface;
  egging: DialogueInterface;
}
export interface UserProgressRegistry {
  achievements: Record<string, AchievementCategory>;
  lifetimeStats: SessionStatsInterface;
  locationProgress: Partial<
    Record<MatchLocationType, LocationDetailsInterface>
  >;
}
