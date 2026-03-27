export type AttributeValueType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
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
export type IconSizeType = "small" | "medium" | "large";
export type VillainThemeType =
  | "classic"
  | "gritty"
  | "modern"
  | "classy"
  | "pro";

export interface CardInterface {
  value: CardValueType;
  suit: CardSuitType;
  side: CardSideType;
  currentLocation: CurrentLocationType;
  isDiscarded: boolean;
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
export interface FetchInterface {
  status: FetchStatusType;
  message: string;
  payload: null | object;
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
// app/types.ts (or wherever you defined this)
export interface PhaseInstruction {
  cards: number | "variable";
  hero?: CardSideType; // Added ?
  opp?: CardSideType; // Added ?
  community?: CardSideType; // Already optional
}
export interface PlayerInterface {
  id: string | null;
  name: string;
  type: PlayerType;
  difficulty?: DifficultyType;
  preferredDifficulty?: DifficultyType;
  currentHand: CardInterface[];
  isDiscarding?: boolean;
  money: number;
  chips: ChipMapInterface;
  comments?: Partial<Record<CurrentSituationType, string[]>> | null;
  level?: number | null;
  xp?: number | null;
  nextLevel?: number | null;
  availableDecks?: DeckStyleType[] | null;
  currentDeckChoice?: DeckStyleType | null;
  plei?: number | null;
}
