export type AttributeValueType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type BettingActionType = "call" | "raise" | "fold" | "check";
export type CardValueType =
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | "J"
  | "Q"
  | "K"
  | "A";
export type CardSuitType = "club" | "diamond" | "heart" | "spade";
export type CardSideType = "face-up" | "face-down";
export type CardColorType = "red" | "black";
export type ChipColorType = "white" | "red" | "green" | "blue" | "black";
export type ChipValueType = 1 | 5 | 10 | 25 | 100;
export type ChipIconType =
  | "face"
  | "side"
  | "faceDropShadow"
  | "sideDropShadow";
export type ContestantType = "hero" | "opponent" | "dealer";
export type CurrentLocationType =
  | "p1"
  | "p2"
  | "p3"
  | "p4"
  | "p5"
  | "dealer"
  | "demo";
export type CurrentSituationType =
  | "strongHand"
  | "weakHand"
  | "bluffing"
  | "gloating"
  | "sulking"
  | "neutral"
  | "nagging"
  | "egging";
export type DeckNumberType = 1 | 2 | 3 | 4 | 5;
export type DeckStyleType =
  | "arrowBolt"
  | "explodingFace"
  | "inBloom"
  | "redFire"
  | "theFlyingCow";
export type DifficultyType = "easy" | "normal" | "hard";
export type FetchStatusType = "idle" | "pending" | "failed" | "succeeded";
export type GameDisplayType =
  | "title"
  | "match"
  | "postGame"
  | "mainMenu"
  | "settings"
  | "preGame";
export type GamePhaseType =
  | "preFlop"
  | "flop"
  | "turn"
  | "river"
  | "showdown"
  | "ante"
  | "deal"
  | "bettingOne"
  | "draw"
  | "bettingTwo"
  | "thirdStreet"
  | "fourthStreet"
  | "fifthStreet"
  | "sixthStreet"
  | "seventhStreet"
  | "notInGameYet";
export type GamePhaseConfigType = Record<
  string,
  Record<string, PhaseInstruction>
>;
export type HandType =
  | "single-high"
  | "pair"
  | "two-pair"
  | "straight"
  | "flush"
  | "three-of-a-kind"
  | "full-house"
  | "four-of-a-kind"
  | "straight-flush"
  | "royal-flush"
  | "tbd";
export type IconSizeType = "small" | "medium" | "large";
export type LastResultType = "win" | "loss" | "fold " | null;
export type MatchType = "draw" | "holdem" | "stud";
export type MatchLocationType =
  | "shelter"
  | "low-vault-lounge"
  | "neon-alley-club"
  | "halls"
  | "compound"
  | "holdem-hotel"
  | "draw-den"
  | "stud-stay"
  | "atrium"
  | "zenith";
export type NextLevelXpType =
  | 5
  | 20
  | 45
  | 80
  | 125
  | 180
  | 245
  | 320
  | 405
  | 500;
export type NumberOfOpponentsType = 1 | 2 | 3 | 4 | 5 | "tbd";
export type PlayerType = "human" | "computer";
export type PlayStyleType = "passive" | "loose" | "tight" | "aggressive";
export type PokerChoiceType =
  | "ante"
  | "call"
  | "check"
  | "fold"
  | "raise"
  | null;
export type VillainThemeType =
  | "classic"
  | "gritty"
  | "modern"
  | "classy"
  | "pro";

// interfaces

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
  };
  playingMatch: boolean;
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
  sessionStats: {
    handsWon: number;
    handsLost: number;
    currentWinStreak: number;
    currentLossStreak: number;
    totalSessionProfit: number; // Can be negative
    lastHandResult: LastResultType;
  };
  profile: {
    level?: number | null;
    xp?: number | null;
    nextLevel?: number | null;
    availableDecks?: DeckStyleType[] | null;
    currentDeckChoice?: DeckStyleType | null;
    plei?: number | null;
    isSpecial?: boolean;
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

export type AchievementCategory =
  | "WIN_STREAK"
  | "BANKROLL"
  | "LOCATION_MASTER"
  | "GAME_SPECIALIST";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  isUnlocked: boolean;
  dateUnlocked?: string; // ISO string
  rewardPlei: number;
}

export interface LocationDetailsInterface {
  stats: PlayerStatsInterface;
  bossDefeated: boolean;
  timesBossEncountered: number;
  unlockedLocalItems: string[]; // e.g., ["neon-deck", "high-roller-avatar"]
  rank: number; // 0 to 5 "stars" for that area
}

// Gary's "Trophy Case" Map
export interface UserProgressRegistry {
  achievements: Record<string, Achievement>;
  lifetimeStats: PlayerStatsInterface;
  locationProgress: Partial<
    Record<MatchLocationType, LocationDetailsInterface>
  >;
}

export interface PlayerStatsInterface {
  totalHandsPlayed: number;
  totalMatchesWon: number;
  biggestPotWon: number;
  locationsVisited: MatchLocationType[];
  gamesMastered: MatchType[];
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
  bestHandRank: HandType; // e.g., 'full-house'
  opponentsKnockedOut: number;
  bluffsSucceeded: number;

  // Progression
  xpGained: number;
  newLevelReached: boolean;
  unlockedItemIds: string[]; // IDs to be cross-referenced with VendingInventory
}
