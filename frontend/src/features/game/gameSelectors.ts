import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { createChips } from "../../functions/factory/factory";
import { evaluatePokerHand } from "../../functions/utils/utils";
import { handRanks, cardSuitIcons } from "../../app/assets";
import { type CardSuitType } from "../../app/types";

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
    const allBets = [
      match.hero.currentBet,
      ...match.opponents.map((p) => p.currentBet),
    ];
    return Math.max(...allBets, 0);
  },
);

/**
 * ============================================================
 * HERO SELECTORS (Specific to the Human Player)
 * ============================================================
 */
export const selectHero = createSelector([selectCurrentMatch], (m) => m.hero);
export const selectHerosId = createSelector([selectHero], (h) => h.id);
export const selectHeroName = createSelector([selectHero], (h) => h.name);
export const selectHeroMoney = createSelector([selectHero], (h) => h.money);
export const selectHeroIsFolded = createSelector(
  [selectHero],
  (h) => h.isFolded,
);
export const selectHeroHand = createSelector(
  [selectHero],
  (h) => h.currentHand,
);
export const selectHeroCurrentBet = createSelector(
  [selectHero],
  (h) => h.currentBet,
);

// Derived Hero Data
export const selectHeroChips = createSelector([selectHeroMoney], (money) =>
  createChips(money),
);

export const selectHeroHandRank = createSelector([selectHeroHand], (hand) =>
  !hand || hand.length === 0 ? handRanks.highCard : evaluatePokerHand(hand),
);

export const selectHeroAmountToCall = createSelector(
  [selectHeroCurrentBet, selectCurrentMaxBet],
  (myBet, maxBet) => Math.max(maxBet - myBet, 0),
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
    if (match.hero.id === playerId) return match.hero;
    return match.opponents.find((p) => p.id === playerId) || null;
  },
);

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
        return "Ante Up";
      case "deal":
        return "Deal Round";
      case "draw":
        return discardCount > 0
          ? `Confirm Draw (${discardCount})`
          : "Stand Pat";
      case "bettingOne":
      case "bettingTwo":
        return "Confirm Bet";
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
    isAllin: false,
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
