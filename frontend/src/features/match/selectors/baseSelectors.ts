// baseSelectors.ts
import type { RootState } from "../../../app/store/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectMatch = (state: RootState) => state.match;
export const selectCurrentHand = (state: RootState) => state.match.currentHand;
export const selectPlayers = (state: RootState) =>
  state.match.currentHand.players;

export const selectCurrentMaxBet = createSelector(
  [selectPlayers],
  (players) => {
    const allBets = players.map((p) => p.state.currentBet ?? 0);
    return Math.max(...allBets, 0);
  },
);
export const selectDeckStyle = (state: RootState) =>
  state.match.general.deckStyle;
