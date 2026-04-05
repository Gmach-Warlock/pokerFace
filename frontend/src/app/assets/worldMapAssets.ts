import { INITIAL_SESSION_STATS } from "./profileAssets";
import type { LocationDetailsInterface } from "../interfaces/worldMapInterfaces";
import type { MatchLocationType } from "../types/worldMapTypes";

export interface MapNodeInterface extends LocationDetailsInterface {
  id: MatchLocationType;
  displayName: string;
  coordinates: { x: number; y: number }; // Percentage-based for responsiveness
  flavorText: string;
}

export const worldMapRegistry: Partial<
  Record<MatchLocationType, MapNodeInterface>
> = {
  shelter: {
    id: "shelter",
    displayName: "The Shelter",
    coordinates: { x: 15, y: 80 }, // Bottom left, "the underground"
    flavorText:
      "Dim lights and cheap synth-ale. The only place that doesn't ask for ID.",
    requirements: { minLevel: 1, entryFeePlei: 0 },
    progress: {
      rank: 0,
      unlockedLocalItems: [],
      bossDefeated: false,
      timesBossEncountered: 0,
    },
    stats: INITIAL_SESSION_STATS,
  },
  halls: {
    id: "halls",
    displayName: "The Halls",
    coordinates: { x: 40, y: 60 },
    flavorText: "A corporate-owned corridor. Cleaner cards, higher stakes.",
    requirements: { minLevel: 5, entryFeePlei: 100 },
    progress: {
      rank: 0,
      unlockedLocalItems: [],
      bossDefeated: false,
      timesBossEncountered: 0,
    },
    stats: INITIAL_SESSION_STATS,
  },
  "neon-alley-club": {
    id: "neon-alley-club",
    displayName: "Neon Alley",
    coordinates: { x: 70, y: 40 },
    flavorText:
      "Where the city screams in color. Watch your back and your bankroll.",
    requirements: { minLevel: 15, entryFeePlei: 500 },
    progress: {
      rank: 0,
      unlockedLocalItems: [],
      bossDefeated: false,
      timesBossEncountered: 0,
    },
    stats: INITIAL_SESSION_STATS,
  },
};
