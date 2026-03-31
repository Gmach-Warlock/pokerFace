import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { createChips } from "../../functions/factory/factory";
import { handRanks, cardSuitIcons } from "../../app/assets";
import { type CardSuitType, type DeckStyleType } from "../../app/types";
import { evaluatePokerHand, getAIDiscardIndices } from "../../app/logic/logic";

/**
 * ============================================================
 * BASE SELECTORS (The "Roots")
 * ============================================================
 */
export const selectGame = (state: RootState) => state.game;

export const selectCurrentMatch = createSelector(
  [selectGame],
  (game) => game.currentMatch,
);

/**
 * ============================================================
 * GLOBAL GAME STATE (Table, Pot, Phase)
 * ============================================================
 */
export const selectCurrentPhase = createSelector(
  [selectCurrentMatch],
  (m) => m.currentPhase.phase,
);
export const selectPot = createSelector([selectCurrentMatch], (m) => m.pot);
export const selectMatchLocation = createSelector(
  [selectCurrentMatch],
  (m) => m.matchLocation,
);
export const selectDeckStyle = createSelector(
  [selectGame],
  (g) => g.currentMatch.deckStyle,
);

export const selectIsBettingPhase = createSelector(
  [selectCurrentPhase],
  (phase) => phase === "bettingOne" || phase === "bettingTwo",
);

export const selectCurrentMaxBet = createSelector(
  [selectCurrentMatch],
  (match) => {
    const allBets = match.players.map((p) => p.currentBet ?? 0);
    return Math.max(...allBets, 0);
  },
);
/**
 * ============================================================
 * HERO SELECTORS (Specific to the Human Player)
 * ============================================================
 */
export const selectHero = (state: RootState) =>
  state.game.currentMatch.players.find((p) => p.type === "human");
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
  (h) => h?.isFolded ?? false,
);
export const selectHeroHand = createSelector(
  [selectHero],
  (h) => h?.currentHand ?? [],
);
export const selectHeroCurrentBet = createSelector(
  [selectHero],
  (h) => h?.currentBet ?? 0,
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
  [
    selectCurrentMatch,
    (_state: RootState, playerId: string | null) => playerId,
  ],
  (match, playerId) => {
    if (!playerId) return null;
    return match.players.find((p) => p.id === playerId) || null;
  },
);
export const selectMatch = (state: RootState) => state.game.currentMatch;

export const selectPlayers = (state: RootState) =>
  state.game.currentMatch.players;

export const selectNpcDiscards = createSelector([selectMatch], (match) => {
  // Returns an array of arrays: [[indices for NPC 1], [indices for NPC 2]]
  return match.players.map((player) => {
    if (player.type === "computer" && !player.isFolded) {
      return getAIDiscardIndices(player.currentHand);
    }
    return [];
  });
});

export const selectOpponents = createSelector([selectCurrentMatch], (match) => {
  return match.players.filter((player) => player.type === "computer");
});

export const selectOpponentStatusClass = createSelector(
  [selectPlayerById],
  (player) => {
    if (!player) return "";
    if (player.isFolded) return "opponent__card--folded";
    if (player.isAllin) return "opponent__card--all-in";
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
  (p) => p?.isFolded ?? false,
);
export const selectPlayerChips = createSelector(
  [selectPlayerById],
  (p) => p?.chips ?? { white: 0, red: 0, blue: 0, green: 0, black: 0 },
);

/**
 * ============================================================
 * Betting & UI SELECTORS
 * ============================================================
 */

export const selectWinnerId = createSelector(
  [selectCurrentMatch],
  (m) => m.winnerId,
);
export const selectWinningHandLabel = createSelector(
  [selectCurrentMatch],
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
export const selectDeck = createSelector(
  [selectCurrentMatch],
  (match) => match.deck,
);

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
    sessionStats: {
      handsWon: 0,
      handsLost: 0,
      currentWinStreak: 0,
      currentLossStreak: 0,
      totalSessionProfit: 0,
      lastHandResult: null,
    },
    profile: {
      level: 1,
      xp: 0,
      nextLevel: 5, // or whatever your NextLevelXpType starts at
      availableDecks: ["arrowBolt"] as DeckStyleType[],
      currentDeckChoice: "arrowBolt" as DeckStyleType,
      plei: 0,
      isSpecial: false,
    },
  }),
);
export const selectAvailableDecks = createSelector(
  [selectPlayerData],
  (player) => player.availableDecks,
);

export const selectAvailableLocations = createSelector(
  [selectPlayerData],
  (player) => player.availableLocations,
);
export const selectPlayerHandEval = createSelector(
  [
    (state: RootState) => state.game.currentMatch.players,
    (_state: RootState, index: number) => index,
  ],
  (players, index) => {
    const hand = players[index]?.currentHand || [];
    return evaluatePokerHand(hand);
  },
);
