import type { DeckStyleType } from "../types/matchTypes";
import type { MatchLocationType } from "../types/worldMapTypes";
import type { AchievementCategory } from "../types/profileTypes";
import type { SessionStatsInterface, PlayerInterface } from "./matchInterfaces";
import type { FetchStatusType } from "../types/profileTypes";
import type { LocationDetailsInterface } from "./worldMapInterfaces";

export interface AchievementInterface {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  isUnlocked: boolean;
  dateUnlocked: string | null;
  currentProgress: number;
  targetValue: number;
  rewardPlei: number;
  icon?: string; // e.g., "🏆" or a path to a SVG
}
export interface AuthorizeState {
  meta: {
    authorized: boolean;
    id: string;
    username: string;
    email: string;
  };
  playerData: PlayerProfileInterface;
}
export interface FetchInterface {
  status: FetchStatusType;
  message: string;
  payload: null | object;
}

export interface PlayerProfileInterface {
  level: number;
  xp: number;
  nextLevel: number;
  availableLocations: string[];
  availableDecks: DeckStyleType[] | null;
  locationsVisited: MatchLocationType[];
  locationsMastered: MatchLocationType[];
  currentDeckChoice?: DeckStyleType | null;
  plei: number | null;
  isSpecial?: boolean;
  stats: {
    lifetime: SessionStatsInterface;
  };
  achievements?: AchievementInterface[];
}

export interface ProfileInterface {
  meta: {
    authorized: boolean;
    id: string;
    username: string;
    email: string;
    password: string;
  };
  playerData: PlayerInterface;
}

export interface UserProgressRegistry {
  achievements: Record<string, AchievementCategory>;
  lifetimeStats: SessionStatsInterface;
  locationProgress: Partial<
    Record<MatchLocationType, LocationDetailsInterface>
  >;
}
