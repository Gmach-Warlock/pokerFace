export const API_URL = import.meta.env.VITE_MY_API_URL;

export type SituationType =
  | "baiting"
  | "bigPot"
  | "bluffing"
  | "egging"
  | "gloating"
  | "nagging"
  | "neutral"
  | "onStreak"
  | "strongHand"
  | "sulking"
  | "weakHand"
  | "witnessStreak";
