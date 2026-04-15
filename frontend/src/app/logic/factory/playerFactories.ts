import type { PlayerInterface } from "../../interfaces/matchInterfaces";
import type { PlayerType } from "../../types/matchTypes";
import { createChips } from "./pokerFactories";
import {
  INITIAL_LIFETIME_STATS,
  INITIAL_SESSION_STATS,
} from "../../assets/profile/profileAssets";

export const createHero = (baseData: PlayerInterface): PlayerInterface => {
  return {
    general: {
      id: baseData.general.id || "hero-001",
      name: baseData.general.name || "Gary",
      type: "human",
      isDealer: false,
    },
    state: {
      hand: [],
      chips: createChips(baseData.profile.money),
      currentBet: 0,
      isFolded: false,
      isAllIn: false,
      hasActed: false,
      lastAction: null,
      lastActionValue: 0,
      isDiscarding: false,
      position: 0,
    },
    profile: baseData.profile,
    stats: baseData.stats,
    flags: {
      isInitialLoad: false,
      isProcessingAction: false,
      isWinner: false,
      hasTurnFocus: true,
    },
  };
};

export const createPlayer = (
  baseData: Partial<PlayerInterface>,
  type: PlayerType,
  isDealer: boolean = false,
): PlayerInterface => {
  const startingMoney = isDealer
    ? 0
    : (baseData.profile?.money ?? (type === "human" ? 500 : 500));

  return {
    general: {
      id: baseData.general?.id ?? crypto.randomUUID(),
      name: baseData.general?.name ?? (type === "human" ? "Gary" : "NPC"),
      type,
      isDealer,
      difficulty: baseData.general?.difficulty ?? "normal",
    },
    state: {
      hand: [],
      chips: createChips(startingMoney),
      currentBet: 0,
      isFolded: false,
      isAllIn: false,
      hasActed: false,
      lastAction: null,
      lastActionValue: 0,
      isDiscarding: false,
      position: baseData.state?.position ?? 0,
    },
    profile: {
      level: baseData.profile?.level ?? 1,
      xp: baseData.profile?.xp ?? 0,
      nextLevel: baseData.profile?.nextLevel ?? 1000,
      money: startingMoney,
      plei: baseData.profile?.plei ?? 0,
      availableLocations: baseData.profile?.availableLocations ?? ["shelter"],
      availableDecks: baseData.profile?.availableDecks ?? ["arrowBolt"],
      locationsVisited: baseData.profile?.locationsVisited ?? [],
      locationsMastered: baseData.profile?.locationsMastered ?? [],
      currentDeckChoice: baseData.profile?.currentDeckChoice ?? "arrowBolt",
    },
    stats: {
      lifetime: baseData.stats?.lifetime ?? INITIAL_LIFETIME_STATS,
      session: INITIAL_SESSION_STATS,
    },
    flags: {
      isInitialLoad: true,
      isProcessingAction: false,
      isWinner: false,
      hasTurnFocus: type === "human",
    },
    ...(baseData.personality && { personality: baseData.personality }),
  };
};
