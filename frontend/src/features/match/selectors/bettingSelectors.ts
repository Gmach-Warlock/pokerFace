import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store/store";
import {
  selectHeroHand,
  selectHerosId,
  selectHeroMoney,
  selectHeroAmountToCall,
} from "./heroSelectors";
import { selectCurrentPhase, selectMatch } from "./stateSelectors";
import { selectPlayerName } from "./playerSelectors";

/**
 * ============================================================
 * Betting & UI SELECTORS
 * ============================================================
 */
export const selectCurrentPot = (state: RootState) =>
  state.match.currentHand.pot;
export const selectWinnerId = createSelector(
  [selectMatch],
  (m) => m.results.winnerId,
);
export const selectWinningHandLabel = createSelector(
  [selectMatch],
  (m) => m.results.winningHand,
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
  [selectCurrentPhase, selectDiscardCount, selectHeroAmountToCall],
  (currentPhase, discardCount, amountToCall) => {
    const p = currentPhase.phase.toLowerCase();

    switch (p) {
      case "ante":
        return "Ante Up & Deal";
      case "deal":
        return "Start Betting";
      case "draw":
        return discardCount > 0 ? `Swap ${discardCount} Cards` : "Stand Pat";
      case "bettingone":
      case "bettingtwo":
        return amountToCall > 0 ? `Call $${amountToCall}` : "Check";
      case "showdown":
        return "See Results";
      default:
        return `Finish ${currentPhase.phase}`;
    }
  },
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

export const selectCurrentTableBet = createSelector(
  [selectMatch],
  (match) => match.currentHand.currentBetOnTable ?? 0,
);
export const selectIsBigPot = (state: RootState) => {
  const { pot, players } = state.match.currentHand;
  return pot > players.length * 100;
};
