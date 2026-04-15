import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store/store";
import {
  selectHeroHand,
  selectHerosId,
  selectHeroMoney,
  selectHeroAmountToCall,
} from "./heroSelectors";
import { selectMatch } from "./baseSelectors";
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
