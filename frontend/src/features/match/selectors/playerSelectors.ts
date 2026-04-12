import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store/store";
import { evaluatePokerHand } from "../../../app/logic/match/evaluators/evaluators";
import { selectMatch } from "./stateSelectors";

/**
 * ============================================================
 * GENERIC PLAYER SELECTORS (Hero or Opponent by ID)
 * ============================================================
 */

export const selectPlayerById = createSelector(
  [selectMatch, (_state: RootState, playerId: string | null) => playerId],
  (match, playerId) => {
    if (!playerId) return null;
    return (
      match.currentHand.players.find((p) => p.general.id === playerId) || null
    );
  },
);

export const selectPlayerName = createSelector(
  [selectPlayerById],
  (p) => p?.general.name ?? "Unknown",
);
export const selectPlayerMoney = createSelector(
  [selectPlayerById],
  (p) => p?.profile.money ?? 0,
);
export const selectIsPlayerFolded = createSelector(
  [selectPlayerById],
  (p) => p?.state.isFolded ?? false,
);
export const selectPlayerChips = createSelector(
  [selectPlayerById],
  (p) => p?.state.chips ?? { white: 0, red: 0, blue: 0, green: 0, black: 0 },
);

export const selectDealer = createSelector([selectMatch], (match) => {
  const { players, dealerIndex } = match.currentHand;
  return players[dealerIndex] || null;
});

// This helper is great for UI if you ever decide to show a "Dealer" label
export const selectIsPlayerDealer = (playerId: string) =>
  createSelector(
    [selectMatch],
    (match) =>
      match.currentHand.players[match.currentHand.dealerIndex]?.general.id ===
      playerId,
  );

export const selectPlayers = (state: RootState) =>
  state.match.currentHand.players;

export const selectOpponents = createSelector([selectMatch], (match) => {
  return match.currentHand.players.filter(
    (player) => player.general.type === "computer",
  );
});

export const selectOpponentStatusClass = createSelector(
  [selectPlayerById],
  (player) => {
    if (!player) return "";
    if (player.state.isFolded) return "opponent__card--folded";
    if (player.state.isAllIn) return "opponent__card--all-in";
    return "opponent__card--active";
  },
);
export const selectPlayerHandEval = createSelector(
  [
    (state: RootState) => state.match.currentHand.players,
    (_state: RootState, index: number) => index,
  ],
  (players, index) => {
    const hand = players[index]?.state.hand || [];
    return evaluatePokerHand(hand);
  },
);
