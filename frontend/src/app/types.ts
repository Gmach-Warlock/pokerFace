import type { PhaseInstruction } from "./interfaces";

export type AchievementCategory = "COMBAT" | "WEALTH" | "EXPLORATION" | "STYLE";
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
  | "none"
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
export type MatchMapInterface = Partial<
  Record<MatchLocationType, VillainThemeType[]>
>;
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
