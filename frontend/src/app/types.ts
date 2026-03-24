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
export type DeckStyleType =
  | "arrowBolt"
  | "explodingFace"
  | "inBloom"
  | "redFire"
  | "theFlyingCow";
export type FetchStatusType = "idle" | "pending" | "failed" | "succeeded";
export type GameDisplayType =
  | "title"
  | "match"
  | "postGame"
  | "mainMenu"
  | "settings"
  | "preGame";
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
export type MatchType = "draw" | "holdem" | "stud";
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
export type IconSizeType = "small" | "medium" | "large";
export type VillainThemeType = "classic" | "gritty" | "modern" | "pro";

export interface CardInterface {
  value: CardValueType;
  suit: CardSuitType;
  side: CardSideType;
  currentLocation: CurrentLocationType;
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
export interface FetchInterface {
  status: FetchStatusType;
  message: string;
  payload: null | object;
}
export interface HandInterface {
  matchType: MatchType;
  cards: CardInterface[];
  currentLocation: CurrentLocationType;
  hand: HandType;
}
export interface HandResultInterface {
  playerId: string;
  handRank: number;
  handLabel: string;
  winningCards: CardInterface[];
  kickers: CardInterface[];
}
export interface PlayerInterface {
  id: string | null;
  name: string;
  type: "human" | "computer";
  cards: CardInterface[];
  moneyTotal: number;
  chips: ChipMapInterface;
  comments?: Partial<Record<CurrentSituationType, string[]>>;
  level?: number;
  experience?: number;
  availableDecks?: DeckStyleType[];
  currentDeckChoice?: DeckStyleType;
}
