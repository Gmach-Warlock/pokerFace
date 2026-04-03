import type {
  BettingActionType,
  CardValueType,
  CardSuitType,
  CardSideType,
  CurrentLocationType,
  CurrentSituationType,
  ChipColorType,
  ChipIconType,
  ContestantType,
  DeckNumberType,
  DeckStyleType,
  DifficultyType,
  HandType,
  LastResultType,
  MatchLocationType,
  MatchType,
  PlayerType,
  PokerChoiceType,
  NumberOfOpponentsType,
} from "../types/matchTypes";
import type { GamePhaseInterface } from "./gameInterfaces";
import type { PlayerProfileInterface } from "./profileInterfaces";

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
export interface EvaluatedHandInterface {
  value: number;
  label: string;
  rankValue: number;
  strength: string;
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
  availableDecks?: DeckStyleType[] | null;
  money: number;
  currentMatch: {
    chips: ChipMapInterface;
    currentBet: number;
    hasActed: boolean;
    lastAction?: PokerChoiceType;
    isAllin: boolean;
    currentDeckChoice?: DeckStyleType | null;
    currentHand: CardInterface[];
    isDiscarding?: boolean;
    isFolded: boolean;
    sessionStats: SessionStatsInterface;
  };
  profile?: PlayerProfileInterface;
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
