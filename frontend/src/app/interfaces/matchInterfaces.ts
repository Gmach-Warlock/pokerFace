import type {
  BettingActionType,
  CardValueType,
  CardSuitType,
  CardSideType,
  CurrentLocationType,
  ChipColorType,
  ChipIconType,
  ContestantType,
  DeckNumberType,
  DeckStyleType,
  DifficultyType,
  HandType,
  LastResultType,
  MatchType,
  PlayerType,
  PokerChoiceType,
  NumberOfOpponentsType,
  MatchPhaseType,
} from "../types/matchTypes";
import type { VillainThemeType } from "../types/villainsTypes";
import type { MatchLocationType } from "../types/worldMapTypes";
import type { PlayerProfileInterface } from "./profileInterfaces";

export interface BaseMatchInterface {
  general: {
    id: string;
    numberOfOpponents: NumberOfOpponentsType;
    deckStyle: DeckStyleType;
    difficultyLevel: DifficultyType;
    matchLocation: MatchLocationType;
    matchType: MatchType;
    numberOfDecks: DeckNumberType;
    playingMatch: boolean;
  };
  config: {
    rules: {
      ante: number;
      minBet: number;
      maxBet?: number; // For Limit/No-Limit logic
      blindStructure?: "static" | "increasing";
      turnTimer: number; // For multiplayer/NPC think time
    };
    limits: {
      maxPlayers: number;
      minBuyIn: number;
    };
  };
  currentHand: {
    players: PlayerInterface[];
    handNumber: number;
    dealerIndex: number;
    deck: CardInterface[];
    pot: number;
    currentBetOnTable: number;
    activePlayerIndex: number;
    lastRaiserId: string | null;
    isRoundTransitioning: boolean;
    actionMessage: string;
    messageId: number;
    currentPhase: MatchPhaseInterface;
  };
  results: {
    winnerId?: string;
    winningHand?: string;
    lastWinAmount?: number;
    isGameOver?: boolean;
    handHistory?: {
      playerId: string;
      finalHandName: string;
      wasBluff: boolean;
    }[];
  };
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
  visuals: {
    theme: "neo-tokyo" | "cyber-punk" | "classic";
    skylineStatus: "active" | "dimmed" | "flickering";
    tableColor: string;
    activeEffects: string[]; // e.g., ['neon-glow', 'rain-overlay']
  };
}
export interface BettingButtonProps {
  onClick: () => void;
}
export interface BettingButtonPropsInterface {
  label: string;
  isConfirming?: boolean;
}

export interface BettingInterface {
  currentPot?: number;
  heroMoney?: number;
  onConfirm: (amount: number, type: BettingActionType) => void;
  currentTableBet?: number;
  currentPlayerBet?: number;
}

export interface BetValidationResultInterface {
  valid: boolean;
  reason?: string;
}
export interface CardInterface {
  value: CardValueType;
  suit: CardSuitType;
  side: CardSideType;
  currentLocation: CurrentLocationType;
  isDiscarded: boolean;
  deckDesign: string;
}
export interface CasinoVariantSpecifics {
  dealersHand: CardInterface[];
  houseEdge: number;
  payoutMultiplier: number; // For scaling wins based on hand strength
  minDealerQualifyingRank?: number; // e.g., "Dealer must have a pair of 4s to play"
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

export interface DrawSpecifics {
  discardLimit: number;
  maxDiscardsPerPlayer: number;
}

export interface EvaluatedHandInterface {
  label: string;
  rankValue: number;
  strength: number;
}

export interface HoldemSpecifics {
  communityCards: CardInterface[]; // The Flop, Turn, and River
  burnCards: CardInterface[]; // The cards discarded before each "street"
  buttonIndex: number; // The dealer position
  bigBlind: number;
  smallBlind: number;
}
// matchInterfaces.ts

export interface MatchInterface extends BaseMatchInterface {
  /**
   * Encapsulates data unique to the specific poker variant
   * (e.g., community cards for Hold'em, discard limits for Draw)
   */
  variantSpecifics: {
    casinoVariantSpecifics: CasinoVariantSpecifics;
    drawSpecifics: DrawSpecifics;
    holdemSpecifics: HoldemSpecifics;
    noSpecifics: NoSpecificsInterface;
    studSpecifics: StudSpecifics;
  };
}

export interface MatchPhaseInterface {
  type: MatchType;
  phase: MatchPhaseType;
  step: number;
}

export interface MatchStateInterface {
  matchType: MatchType;
  currentPhase: MatchPhaseInterface;
  deck: CardInterface[];
  players: PlayerInterface[];
  pot: number;
  currentBetOnTable: number;
  activePlayerIndex: number;
  dealerIndex: number;
  location: string;
  // Use a partial or null for game-specific data
  holdemData?: {
    communityCards: CardInterface[];
  };
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
export interface NoSpecificsInterface {
  isWaiting: true;
  lobbyMessage: string;
  readyPlayers: string[]; // IDs of players who have clicked "Ready"
}
export interface PhaseInstruction {
  cards: number | "variable";
  target: "players" | "board";
  side: CardSideType;
  hero?: CardSideType;
  opp?: CardSideType;
  community?: CardSideType;
}
export interface PlayerInterface {
  // Identity: Who is this? (Static)
  general: {
    id: string | null;
    name: string;
    type: PlayerType;
    difficulty?: DifficultyType;
    isDealer: boolean;
  };

  // State: What are they doing right now? (Volatile - Resets every hand)
  state: {
    hand: CardInterface[];
    chips: ChipMapInterface;
    currentBet: number;
    isFolded: boolean;
    isAllIn: boolean;
    hasActed: boolean;
    lastAction?: PokerChoiceType;
    isDiscarding?: boolean;
    position: number; // Table seat index
  };

  // Account: What do they own? (Persistent - RPG/Database layer)
  account: {
    totalMoney: number;
    plei: number;
    level: number;
    xp: number;
    unlockedDecks: DeckStyleType[];
    currentDeckChoice: DeckStyleType;
  };

  // Flags: UI & Logic gates (Boolean hell, contained)
  flags: {
    isInitialLoad: boolean;
    isProcessingAction: boolean;
    isWinner: boolean;
    hasTurnFocus: boolean;
  };

  // Analytics: What have they done? (History)
  stats: SessionStatsInterface;
  profile?: PlayerProfileInterface;
  // Behavior: How do they think? (NPC Logic Layer)

  personality?: {
    archetype: VillainThemeType; // and so on
    situations: Record<string, number>;
    tells: {
      physical: string;
      frequency: number;
    };
    unique: {
      lines: Record<string, string>;
      frequency: number;
    };
    traits: {
      isTroll: boolean;
      bluffModifier: number; // 0.0 - 1.0
      aggression: number; // 0.0 - 1.0 (frequency of raising)
      thinkTime: number; // ms delay for "immersion"
      tilt: {
        limit: number;
        comment: string;
        multiplier: number;
      };
    };
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

export interface StudSpecifics {
  // Define any Stud-specific properties here
  // For example:
  upCards: CardInterface[]; // Cards that are face-up
  downCards: CardInterface[]; // Cards that are face-down
}
