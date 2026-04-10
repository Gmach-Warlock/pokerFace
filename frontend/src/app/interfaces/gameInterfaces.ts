import type {
  CurrentLocationType,
  DeckNumberType,
  DeckStyleType,
  DifficultyType,
  GameDisplayType,
  HandType,
  MatchType,
  NumberOfOpponentsType,
} from "../types/matchTypes";
import type { MatchLocationType } from "../types/worldMapTypes";
import type {
  CardInterface,
  PlayerInterface,
  MatchPhaseInterface,
} from "./matchInterfaces";

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
    currentPhase: MatchPhaseInterface;
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
  difficultyLevel: DifficultyType;
  matchLocation: MatchLocationType;
  matchType: MatchType;
  numberOfDecks: DeckNumberType;
  deckStyle: DeckStyleType;
  hero: PlayerInterface;
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
