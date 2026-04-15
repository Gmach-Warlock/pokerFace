import { generateRandomString } from "../general/generalUtils";
import { createChips } from "./pokerFactories";
import type { PlayerInterface } from "../../interfaces/matchInterfaces";
import type { VillainThemeType } from "../../types/villainsTypes";
import { villainPool } from "../../assets/villain/villainAssets";
import {
  INITIAL_SESSION_STATS,
  INITIAL_LIFETIME_STATS,
} from "../../assets/profile/profileAssets";

export const createVillain = (
  theme: VillainThemeType,
  nameOverride?: string,
): PlayerInterface => {
  const getRandomVillainName = (theme: VillainThemeType) => {
    const pool = villainPool[theme];
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const newVillainName = nameOverride || getRandomVillainName(theme);
  const chipMap = createChips(500);

  const newVillain: PlayerInterface = {
    general: {
      id: generateRandomString(8),
      name: newVillainName,
      type: "computer",
      isDealer: false,
      difficulty: "normal",
    },
    state: {
      hand: [],
      chips: chipMap,
      currentBet: 0,
      isFolded: false,
      isAllIn: false,
      hasActed: false,
      lastAction: "check",
      lastActionValue: 0,
      isDiscarding: false,
      position: 0,
    },
    profile: {
      level: 1,
      xp: 0,
      nextLevel: 0,
      money: 500,
      plei: 0,
      availableLocations: [],
      availableDecks: [],
      locationsVisited: [],
      locationsMastered: [],
      currentDeckChoice: null,
      isSpecial: false,
    },
    flags: {
      isInitialLoad: false,
      isProcessingAction: false,
      isWinner: false,
      hasTurnFocus: false,
    },
    stats: {
      lifetime: {
        matches: {
          hand: {
            handsPlayed: 0,
            handsWon: 0,
            handsLost: 0,
            handsTied: 0,
          },
          streak: {
            currentWinStreak: 0,
            currentLossStreak: 0,
            longestWinStreak: 0,
          },
          monetary: {
            totalProfit: 0,
            biggestPotWon: 0,
            biggestLoss: 0,
            totalBuyIn: 0,
            totalCashOut: 0,
            allTimeHighBalance: 0,
            totalRakePaid: 0, // If your game has a "house" fee
            biggestSuckout: 0,
          },
          various: {
            vpipCount: 0,
            pfrCount: 0,
            bluffsAttempted: 0,
            bluffsSucceeded: 0,
            showdownsReached: 0,
            showdownsWon: 0,
          },
          log: {
            startTime: new Date().toISOString(),
            endTime: null,
            lastHandResult: null,
          },
        },
        opponents: {
          opponentsPlayed: {
            classy: [],
            classic: [],
            gritty: [],
            modern: [],
            pro: [],
          },
          totalPlayed: 0,
          opponentsBeaten: {
            classy: [],
            classic: [],
            gritty: [],
            modern: [],
            pro: [],
          },
          totalBeaten: 0,
        },
        achievements: {
          unlocked: [],

          milestones: {
            highestLevelReached: 1,
            totalXpEarned: 0,
          },
          processedTiers: {
            winCount: 0,
            profitMilestone: 0,
          },
          rarityCounts: {
            common: 0,
            rare: 0,
            epic: 0,
            legendary: 0,
          },
          lastUnlockedAt: null,
        },
      },
      session: INITIAL_SESSION_STATS,
    },
  };

  return newVillain;
};

export const createDealer = (): PlayerInterface => {
  return {
    general: {
      id: "dealer-001",
      name: "Dealer",
      type: "computer",
      isDealer: true,
    },
    state: {
      hand: [],
      chips: { white: 0, red: 0, blue: 0, green: 0, black: 0 },
      currentBet: 0,
      isFolded: true,
      isAllIn: false,
      hasActed: false,
      lastAction: null,
      lastActionValue: 0,
      isDiscarding: false,
      position: 2,
    },
    profile: {
      level: 1,
      xp: 0,
      nextLevel: 100,
      money: 0,
      plei: 0,
      availableLocations: [],
      availableDecks: ["arrowBolt"],
      locationsVisited: [],
      locationsMastered: [],
      currentDeckChoice: "arrowBolt",
    },
    stats: {
      lifetime: INITIAL_LIFETIME_STATS,
      session: INITIAL_SESSION_STATS,
    },
    flags: {
      isInitialLoad: true,
      isProcessingAction: false,
      isWinner: false,
      hasTurnFocus: false,
    },
  };
};
