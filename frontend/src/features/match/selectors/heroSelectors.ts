import { createSelector } from "@reduxjs/toolkit";
import type { PlayerInterface } from "../../../app/interfaces/matchInterfaces";
import { selectCurrentMaxBet } from "./stateSelectors";
import { selectDeckStyle, selectMatch } from "./stateSelectors";
import { evaluatePokerHand } from "../../../app/logic/match/evaluators/evaluators";
import {
  handRanks,
  cardSuitIcons,
} from "../../../app/assets/match/matchAssets";
import type { RootState } from "../../../app/store/store";
import type { CardSuitType } from "../../../app/types/matchTypes";
import { createChips } from "../../../app/logic/factory/factoryFunctions";
import {
  INITIAL_LIFETIME_STATS,
  INITIAL_SESSION_STATS,
} from "../../../app/assets/profile/profileAssets";

/**
 * ============================================================
 * HERO SELECTORS (Specific to the Human Player)
 * ============================================================
 */

export const selectPlayerData = (state: RootState) => state.profile.playerData;

export const selectHero = createSelector(
  [selectMatch],
  (match): PlayerInterface => {
    const { localPlayerId } = match.client;
    const players = match.currentHand.players;

    const hero = players.find((p) => p.general.id === localPlayerId);

    if (!hero) {
      // Still throwing the error because if the 'localPlayer'
      // isn't in the seat list, the engine is fundamentally desynced.
      throw new Error(
        `[CLIENT_SYNC_ERROR]: Local player ${localPlayerId} not found in current match.`,
      );
    }

    return hero;
  },
);
export const selectHerosId = createSelector(
  [selectHero],
  (h) => h?.general.id ?? "",
);
export const selectHeroName = createSelector(
  [selectHero],
  (h) => h?.general.name ?? "Unknown",
);
export const selectHeroMoney = createSelector(
  [selectHero],
  (hero) => hero.profile.money,
);
export const selectHeroIsFolded = createSelector(
  [selectHero],
  (h) => h?.state.isFolded ?? false,
);
export const selectHeroHand = createSelector(
  [selectHero],
  (h) => h?.state.hand ?? [],
);
export const selectHeroCurrentBet = createSelector(
  [selectHero],
  (h) => h?.state.currentBet ?? 0,
);

export const selectHeroChips = createSelector(
  [selectHero],
  (hero) => hero.state.chips,
);
export const selectHeroHandRank = createSelector([selectHeroHand], (hand) =>
  !hand || hand.length === 0 ? handRanks.highCard : evaluatePokerHand(hand),
);

export const selectHeroAmountToCall = createSelector(
  [selectHeroCurrentBet, selectCurrentMaxBet],
  (heroBet, maxBet) => {
    return Math.max(maxBet - heroBet, 0);
  },
);

export const selectInitialHeroState = createSelector(
  [selectPlayerData],
  (player): PlayerInterface => {
    // 1. Get the actual money from the persistent state
    const currentMoney = player?.profile?.money ?? 0;

    return {
      // Preserve General Info (ID, Name)
      general: {
        ...player?.general,
        id: player?.general?.id || "unknown",
        name: player?.general?.name || "Player 1",
        type: "human",
      },
      // SYNC: Money -> Chips
      state: {
        ...player?.state,
        hand: [],
        // Generate chips based on actual money instead of a constant
        chips: createChips(currentMoney),
        currentBet: 0,
        isDiscarding: false,
        isFolded: false,
        isAllIn: false,
        hasActed: false,
        lastAction: null,
        lastActionValue: 0,
        position: 0,
      },
      // PRESERVE: Keep actual levels, money, and progress
      profile: {
        ...player?.profile,
        money: currentMoney, // The master value
      },
      // PRESERVE: Keep lifetime stats, but reset session
      stats: {
        lifetime: player?.stats?.lifetime || INITIAL_LIFETIME_STATS,
        session: INITIAL_SESSION_STATS,
      },
      flags: {
        isInitialLoad: true,
        isProcessingAction: false,
        isWinner: false,
        hasTurnFocus: false,
      },
    };
  },
);
export const selectDeck = createSelector(
  [selectMatch],
  (match) => match.currentHand.deck,
);
export const selectAvailableDecks = (state: RootState) =>
  state.profile.playerData.profile?.availableDecks ?? ["arrowBolt"];

export const selectAvailableLocations = (state: RootState) =>
  state.profile.playerData.profile?.availableLocations ?? ["shelter"];

export const selectCleanedDeckKey = createSelector(
  [selectDeckStyle],
  (designKey) => designKey.replace("/", "").replace(".png", ""),
);
export const selectSuitMetadata = createSelector(
  [(_state: RootState, suit: CardSuitType) => suit],
  (suit) => {
    const isRed = suit === "heart" || suit === "diamond";
    return {
      color: isRed ? "red" : "black",
      icon: cardSuitIcons[suit],
      label: suit.charAt(0).toUpperCase() + suit.slice(1),
    };
  },
);
