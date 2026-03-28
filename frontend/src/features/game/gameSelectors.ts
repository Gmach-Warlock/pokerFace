import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export const selectGame = (state: RootState) => state.game;
export const selectCurrentMatch = createSelector(
  [selectGame],
  (game) => game.currentMatch,
);

export const selectDeck = createSelector(
  [selectGame],
  (game) => game.currentMatch.deck,
);
export const selectDeckStyle = createSelector(
  [selectGame],
  (game) => game.currentMatch.deckStyle,
);

export const selectCurrentPhase = createSelector(
  [selectCurrentMatch],
  (match) => match.currentPhase.phase,
);

export const selectHerosHand = createSelector(
  [selectCurrentMatch],
  (match) => match.hero.currentHand,
);
export const selectHerosId = createSelector(
  [selectCurrentMatch],
  (match) => match.hero.id,
);
export const selectDiscardCount = createSelector(
  [selectHerosHand],
  (hand) => hand.filter((card) => card.isDiscarded).length,
);
export const selectHeroMoney = createSelector(
  [selectCurrentMatch],
  (match) => match.hero.money,
);
export const selectIsBettingPhase = createSelector(
  [selectCurrentPhase],
  (phase) => phase === "bettingOne" || phase === "bettingTwo",
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
      default:
        return "Next Round";
    }
  },
);

export const selectMatchLocation = createSelector(
  [selectCurrentMatch],
  (match) => match.matchLocation,
);

export const selectPot = createSelector(
  [selectCurrentMatch],
  (match) => match.pot,
);

export const selectPlayerById = createSelector(
  [selectCurrentMatch, (_state: RootState, playerId: string) => playerId],
  (match, playerId) => {
    // Check opponents first, then hero
    const opponent = match.opponents.find((p) => p.id === playerId);
    if (opponent) return opponent;
    if (match.hero.id === playerId) return match.hero;
    return null; // Return null if no player found
  },
);
export const selectIsPlayerFolded = createSelector(
  [selectPlayerById],
  (player) => {
    // This 'type guard' fixes the TS error
    if (player && typeof player !== "string") {
      return (player.isFolded = true);
    }
    return false;
  },
);
