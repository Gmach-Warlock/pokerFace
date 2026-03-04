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
  | "A"
  | "*";

export type CardIntegerType = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type CardSuitType = "spade" | "club" | "heart" | "diamond";

export interface CardParamsType {
  cardValue: CardIntegerType;
  cardSuit: CardSuitType;
}
