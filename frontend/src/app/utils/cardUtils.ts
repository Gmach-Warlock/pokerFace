import type { CardValueType } from "../types/matchTypes";

export const getPipRotation = (count: number, index: number): boolean => {
  if (count === 3) return index === 2;
  if (count === 6) return index >= 4;
  if (count === 7 || count === 8) return index >= 5;
  return index >= Math.ceil(count / 2);
};

export const getCardCenterpieceClass = (value: CardValueType): string => {
  if (typeof value === "string") return "card__centerpiece-face";
  return value >= 9 ? "card__centerpiece-lg" : "card__centerpiece";
};

export const numberToTextMap: Record<number, string> = {
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
};
