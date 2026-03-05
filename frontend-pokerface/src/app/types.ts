export type CardSuitType = "club" | "diamond" | "heart" | "spade";

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

export interface CardPropsType {
  cardValue: CardValueType;
  cardSuit: CardSuitType;
}

export type ChipColorType = "red" | "green" | "blue" | "black" | "white";

export type ChipValueType = 1 | 5 | 10 | 25 | 100;
