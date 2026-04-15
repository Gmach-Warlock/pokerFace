import { createSelector } from "@reduxjs/toolkit";
import type { PlayerInterface } from "../../../app/interfaces/matchInterfaces";
import { selectMatch } from "./baseSelectors";
import { selectCurrentMaxBet, selectDeckStyle } from "./baseSelectors";
import { evaluatePokerHand } from "../../../app/logic/match/evaluators/evaluators";
import {
  handRanks,
  cardSuitIcons,
} from "../../../app/assets/match/matchAssets";
import type { RootState } from "../../../app/store/store";
import type { CardSuitType } from "../../../app/types/matchTypes";
import { createChips } from "../../../app/logic/factory/pokerFactories";
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
  (match): PlayerInterface | null => {
    const { localPlayerId } = match.client;
    const players = match.currentHand.players;

    const hero = players.find((p) => p.general.id === localPlayerId);

    return hero ?? null;
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
  (hero) => hero?.profile.money ?? 0,
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
  (hero) => hero?.state.chips ?? createChips(0),
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
    const currentMoney = player?.profile?.money ?? 0;

    return {
      general: {
        ...player?.general,
        id: player?.general?.id || "unknown",
        name: player?.general?.name || "Player 1",
        type: "human",
      },
      state: {
        ...player?.state,
        hand: [],
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
      profile: {
        ...player?.profile,
        money: currentMoney,
      },
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
