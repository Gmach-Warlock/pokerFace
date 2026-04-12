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
  MatchType,
  PlayerType,
  PokerChoiceType,
  NumberOfOpponentsType,
  MatchPhaseType,
} from "../types/matchTypes";
import type {
  PlayerEmotionType,
  VillainThemeType,
} from "../types/villainsTypes";
import type { MatchLocationType } from "../types/worldMapTypes";
import type {
  AchievementInterface,
  LifetimeStatsInterface,
  SessionStatsInterface,
} from "./profileInterfaces";

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
  client: {
    localPlayerId: string;
    isObserver: boolean;
    currentIndex: number;
  };
  config: {
    rules: {
      ante: number;
      minBet: number;
      maxBet?: number;
      blindStructure?: "static" | "increasing";
      turnTimer: number;
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
    activeEffects: string[];
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
  payoutMultiplier: number;
  minDealerQualifyingRank?: number;
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
  communityCards: CardInterface[];
  burnCards: CardInterface[];
  buttonIndex: number;
  bigBlind: number;
  smallBlind: number;
}

export interface IBetValidationResult {
  valid: boolean;
  reason?: string;
}

export interface IResolvedBetState {
  newPlayerMoney: number;
  newPlayerBet: number;
  newPot: number;
  isAllIn: boolean;
}

export interface MatchInterface extends BaseMatchInterface {
  variantSpecifics: {
    minimumParticipants: number;
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
  isFinalStreet: boolean;
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
  holdemData?: {
    communityCards: CardInterface[];
  };
}

export interface MatchSummaryInterface {
  general: {
    matchId: string;
    location: MatchLocationType;
    gameType: MatchType;
    difficulty: DifficultyType;
  };
  monetary: {
    finalPot: number;
    earningsCash: number;
    earningsPlei: number;
  };
  performance: {
    wasVictory: boolean;
    bestHandRank: HandType;
    opponentsKnockedOut: number;
    bluffsSucceeded: number;
  };
  progress: {
    xpGained: number;
    newLevelReached: boolean;
    unlockedItemIds: string[];
  };
}
export interface NoSpecificsInterface {
  isWaiting: true;
  lobbyMessage: string;
  readyPlayers: string[];
}
export interface PhaseInstruction {
  cards: number | "variable";
  target: "player" | "players" | "board";
  side: CardSideType;
  hero?: CardSideType;
  opp?: CardSideType;
  community?: CardSideType;
  nextPhase?: MatchPhaseType;
}
export interface PlayerInterface {
  general: {
    id: string;
    name: string;
    type: PlayerType;
    difficulty?: DifficultyType;
    isDealer: boolean;
  };
  state: {
    hand: CardInterface[];
    chips: ChipMapInterface;
    currentBet: number;
    isFolded: boolean;
    isAllIn: boolean;
    hasActed: boolean;
    lastAction: PokerChoiceType;
    lastActionValue: number;
    isDiscarding: boolean;
    position: number;
  };
  profile: {
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
  };
  stats: {
    lifetime: LifetimeStatsInterface;
    session: SessionStatsInterface;
  };
  achievements?: AchievementInterface[];
  flags: {
    isInitialLoad: boolean;
    isProcessingAction: boolean;
    isWinner: boolean;
    hasTurnFocus: boolean;
  };
  personality?: {
    archetype: VillainThemeType;
    currentEmotion: PlayerEmotionType;
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
      bluffModifier: number;
      aggression: number;
      thinkTime: number;
      tilt: {
        limit: number;
        comment: string;
        multiplier: number;
      };
    };
  };
}

export interface StudSpecifics {
  upCards: CardInterface[];
  downCards: CardInterface[];
}
