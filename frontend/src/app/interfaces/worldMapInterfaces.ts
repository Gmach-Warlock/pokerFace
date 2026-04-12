import type { MatchLocationType } from "../types/worldMapTypes";
import type { SessionStatsInterface } from "./profileInterfaces";

export interface LevelTier {
  level: number;
  requiredXp: number;
  rankTitle: string;
  unlocks?: string[]; // IDs for decks or locations
}
export interface LocationDetailsInterface {
  // Static gates: What do I need to get in the door?
  requirements: {
    minLevel: number;
    entryFeePlei: number;
    requiredAchievementId?: string; // e.g., "Must defeat Boss 1"
  };

  // Local Progress: What have I achieved in THIS specific club?
  progress: {
    rank: number; // 0 to 5 "stars" for this area
    unlockedLocalItems: string[]; // e.g., ["neon-deck"]
    bossDefeated: boolean;
    timesBossEncountered: number;
  };

  // The math: How have I played here?
  stats: SessionStatsInterface;
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

export interface WorldNodeInterface {
  id: MatchLocationType;
  displayName: string;
  requirements: {
    minLevel: number;
    completedLocation?: MatchLocationType; // Traceable progression!
  };
  flavorText: string;
}
