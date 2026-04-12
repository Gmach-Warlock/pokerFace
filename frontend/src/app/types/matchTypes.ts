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
export type CurrentLocationType = "deck" | "board" | `p${number}` | "demo";
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
  | "discard"
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
export type MatchPhaseConfigType = {
  [K in MatchType]?: {
    [P in MatchPhaseType]?: PhaseInstruction;
  };
};
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
  | "preflop" // First betting round
  | "flop"
  | "bettingOne" // Post-flop betting
  | "turn"
  | "bettingTwo" // Post-turn betting
  | "river"
  | "bettingThree" // Post-river betting
  | "showdown";
export type IconSizeType = "small" | "medium" | "large";
export type LastResultType = "win" | "loss" | "fold" | "tie" | null;
export type MatchType = "draw" | "holdem" | "stud";

export type MatchMapType = Partial<
  Record<MatchLocationType, VillainThemeType[]>
>;

export type NumberOfOpponentsType = 1 | 2 | 3 | 4 | 5;
export type PlayerType = "human" | "computer" | "dealer";

export type PokerChoiceType =
  | "ante"
  | "call"
  | "check"
  | "fold"
  | "raise"
  | null;

export type StudPhaseType =
  | "ante"
  | "street2"
  | "street3"
  | "street4"
  | "street5"
  | "street6"
  | "river"
  | "bettingOne"
  | "bettingTwo"
  | "bettingThree"
  | "bettingFour"
  | "bettingFive"
  | "showdown";
