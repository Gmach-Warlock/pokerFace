import type { VillainThemeType } from "./villainsTypes";
import type {
  PhaseInstruction,
  DrawSpecifics,
  HoldemSpecifics,
  StudSpecifics,
  CasinoVariantSpecifics,
  NoSpecificsInterface,
} from "../interfaces/matchInterfaces";
import type { MatchLocationType } from "./worldMapTypes";

export type PokerVariantData =
  | DrawSpecifics
  | HoldemSpecifics
  | StudSpecifics
  | CasinoVariantSpecifics
  | NoSpecificsInterface;
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
  | "board"
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
export type DrawPhaseType =
  | "ante"
  | "deal"
  | "bettingOne"
  | "draw"
  | "bettingTwo"
  | "showdown";
export type GameDisplayType =
  | "title"
  | "match"
  | "postGame"
  | "mainMenu"
  | "settings"
  | "preGame";
export type MatchPhaseType =
  | DrawPhaseType
  | HoldemPhaseType
  | StudPhaseType
  | "notInGameYet";
export type MatchPhaseConfigType = Record<
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
export type HoldemPhaseType =
  | "ante"
  | "deal"
  | "flop"
  | "turn"
  | "river"
  | "showdown";
export type IconSizeType = "small" | "medium" | "large";
export type LastResultType = "win" | "loss" | "fold" | "tie" | null;
export type MatchType = "draw" | "holdem" | "stud";

export type MatchMapType = Partial<
  Record<MatchLocationType, VillainThemeType[]>
>;
export type NumberOfOpponentsType = 1 | 2 | 3 | 4 | 5;
export type PlayerType = "human" | "computer";
export type PokerChoiceType =
  | "ante"
  | "call"
  | "check"
  | "fold"
  | "raise"
  | null;

export type StudPhaseType =
  | "ante"
  | "thirdStreet"
  | "fourthStreet"
  | "fifthStreet"
  | "sixthStreet"
  | "seventhStreet"
  | "showdown";
