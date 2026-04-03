import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store/store";
import { createChips } from "../../functions/factory/factory";
import { INITIAL_SESSION_STATS } from "../../app/assets/profileAssets";
import type { MatchLocationType } from "../../app/types/matchTypes";
import type { CardSuitType, DeckStyleType } from "../../app/types/matchTypes";
import {
  evaluatePokerHand,
  getAIDiscardIndices,
} from "../../app/logic/gameLogic";
import { cardSuitIcons, handRanks } from "../../app/assets/matchAssets";

/**
 * ============================================================
 * BASE SELECTORS (The "Roots")
 * ============================================================
 */
export const selectMatch = (state: RootState) => state.match;

/**
 * ============================================================
 * GLOBAL GAME STATE (Table, Pot, Phase)
 * ============================================================
 */
export const selectCurrentPhase = createSelector(
  [selectMatch],
  (m) => m.currentPhase.phase,
);
export const selectPot = createSelector([selectMatch], (m) => m.pot);
export const selectMatchLocation = createSelector(
  [selectMatch],
  (m) => m.matchLocation,
);
export const selectDeckStyle = createSelector(
  [selectMatch],
  (m) => m.deckStyle,
);

export const selectIsBettingPhase = createSelector(
  [selectCurrentPhase],
  (phase) => phase === "bettingOne" || phase === "bettingTwo",
);

export const selectCurrentMaxBet = createSelector([selectMatch], (match) => {
  const allBets = match.players.map((p) => p.currentMatch.currentBet ?? 0);
  return Math.max(...allBets, 0);
});
/**
 * ============================================================
 * HERO SELECTORS (Specific to the Human Player)
 * ============================================================
 */
export const selectHero = createSelector([selectMatch], (match) =>
  match.players.find((p) => p.type === "human"),
);
export const selectHerosId = createSelector([selectHero], (h) => h?.id ?? "");
export const selectHeroName = createSelector(
  [selectHero],
  (h) => h?.name ?? "Unknown",
);
export const selectHeroMoney = createSelector(
  [selectHero],
  (h) => h?.money ?? 0,
);
export const selectHeroIsFolded = createSelector(
  [selectHero],
  (h) => h?.currentMatch.isFolded ?? false,
);
export const selectHeroHand = createSelector(
  [selectHero],
  (h) => h?.currentMatch.currentHand ?? [],
);
export const selectHeroCurrentBet = createSelector(
  [selectHero],
  (h) => h?.currentMatch.currentBet ?? 0,
);

export const selectHeroChips = createSelector([selectHeroMoney], (money) =>
  createChips(money),
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

/**
 * ============================================================
 * GENERIC PLAYER SELECTORS (Hero or Opponent by ID)
 * ============================================================
 */

export const selectPlayerById = createSelector(
  [selectMatch, (_state: RootState, playerId: string | null) => playerId],
  (match, playerId) => {
    if (!playerId) return null;
    return match.players.find((p) => p.id === playerId) || null;
  },
);

export const selectPlayers = (state: RootState) => state.match.players;

export const selectNpcDiscards = createSelector([selectMatch], (match) => {
  // Returns an array of arrays: [[indices for NPC 1], [indices for NPC 2]]
  return match.players.map((player) => {
    if (player.type === "computer" && !player.currentMatch.isFolded) {
      return getAIDiscardIndices(player.currentMatch.currentHand);
    }
    return [];
  });
});

export const selectOpponents = createSelector([selectMatch], (match) => {
  return match.players.filter((player) => player.type === "computer");
});

export const selectOpponentStatusClass = createSelector(
  [selectPlayerById],
  (player) => {
    if (!player) return "";
    if (player.currentMatch.isFolded) return "opponent__card--folded";
    if (player.currentMatch.isAllin) return "opponent__card--all-in";
    return "opponent__card--active";
  },
);

export const selectPlayerName = createSelector(
  [selectPlayerById],
  (p) => p?.name ?? "Unknown",
);
export const selectPlayerMoney = createSelector(
  [selectPlayerById],
  (p) => p?.money ?? 0,
);
export const selectIsPlayerFolded = createSelector(
  [selectPlayerById],
  (p) => p?.currentMatch.isFolded ?? false,
);
export const selectPlayerChips = createSelector(
  [selectPlayerById],
  (p) =>
    p?.currentMatch.chips ?? { white: 0, red: 0, blue: 0, green: 0, black: 0 },
);

/**
 * ============================================================
 * Betting & UI SELECTORS
 * ============================================================
 */

export const selectWinnerId = createSelector([selectMatch], (m) => m.winnerId);
export const selectWinningHandLabel = createSelector(
  [selectMatch],
  (m) => m.winningHand,
);

export const selectWinnerName = createSelector(
  [(state) => state, selectWinnerId, selectHerosId],
  (state, winnerId, heroId) => {
    if (!winnerId) return "";
    return winnerId === heroId ? "YOU" : selectPlayerName(state, winnerId);
  },
);

export const selectDiscardCount = createSelector(
  [selectHeroHand],
  (hand) => hand.filter((card) => card.isDiscarded).length,
);
export const selectActionButtonLabel = createSelector(
  [selectCurrentPhase, selectDiscardCount],
  (phase, discardCount) => {
    switch (phase) {
      case "ante":
        return "Ante Up & Deal";
      case "draw":
        return discardCount > 0
          ? `Swap ${discardCount} Cards`
          : "Stand Pat (Keep All)";
      case "showdown":
        return "See Results";
      default:
        return "Next Phase";
    }
  },
);
export const selectDeck = createSelector([selectMatch], (match) => match.deck);

export const selectMinBetAmount = createSelector(
  [selectHeroAmountToCall],
  (amountToCall) => amountToCall,
);

export const selectMaxBetAmount = createSelector(
  [selectHeroMoney],
  (money) => money,
);

export const selectCallButtonLabel = createSelector(
  [selectHeroAmountToCall],
  (amount) => (amount > 0 ? `Call $${amount}` : "Check"),
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
export const selectPlayerData = (state: RootState) => state.profile.playerData;
export const selectInitialHeroState = createSelector(
  [selectPlayerData],
  (player) => ({
    ...player,
    isFolded: false,
    currentHand: [],
    currentBet: 0,
    hasActed: false,
    actionMessage: "",
    isAllin: false,
    sessionStats: INITIAL_SESSION_STATS,
    profile: {
      level: 1,
      xp: 0,
      nextLevel: 5,
      availableLocations: ["shelter"] as MatchLocationType[],
      availableDecks: ["arrowBolt"] as DeckStyleType[],
      locationsVisited: ["none"] as MatchLocationType[],
      locationsMastered: ["none"] as MatchLocationType[],
      currentDeckChoice: "arrowBolt" as DeckStyleType,
      plei: 0,
      isSpecial: false,
      stats: {
        lifetime: INITIAL_SESSION_STATS,
      },
    },
  }),
);

export const selectAvailableDecks = (state: RootState) =>
  state.profile.playerData.profile?.availableDecks ?? ["arrowBolt"];

export const selectAvailableLocations = (state: RootState) =>
  state.profile.playerData.profile?.availableLocations ?? ["shelter"];

export const selectPlayerHandEval = createSelector(
  [
    (state: RootState) => state.match.players,
    (_state: RootState, index: number) => index,
  ],
  (players, index) => {
    const hand = players[index]?.currentMatch.currentHand || [];
    return evaluatePokerHand(hand);
  },
);
