// shared/types.ts
export type GameLocation =
  | "Shelter"
  | "Neon Alley Club"
  | "Rooftop Lounge"
  | "Underground Casino"
  | "Skyline Penthouse";

export interface User {
  id: string;
  username: string;
  email: string;
  chips: number; // Renamed from currency to match your DB
  level: number;
  xp: number;
  activeDeckId: string;
  unlockedDecks: string[];
  location: GameLocation;
  createdAt: string; // ISO string for easier JSON transport
}

export interface UserProfile {
  id: number;
  username: string;
  chips: number;
  level: number;
  xp: number;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface PokerPlayer extends Pick<User, "id" | "username" | "chips"> {
  currentHand: string[];
  isFolded: boolean;
  currentBet: number;
}
