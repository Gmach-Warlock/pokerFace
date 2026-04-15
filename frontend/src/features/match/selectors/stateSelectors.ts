import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store/store";
import { canAdvancePhaseLogic } from "../../../app/logic/match/utils/stateUtils";
import { selectMatch, selectPlayers } from "./baseSelectors";
import {
  selectHerosId,
  selectHeroHand,
  selectHeroAmountToCall,
  selectHeroMoney,
} from "./heroSelectors";
import { selectPlayerName } from "./playerSelectors";

/**
 * ============================================================
 * STATE SELECTORS
 * ============================================================
 */

export const selectCurrentPhaseName = (state: RootState) =>
  state.match.currentHand.currentPhase.phase;

export const selectCurrentPhase = (state: RootState) =>
  state.match.currentHand.currentPhase;
export const selectPot = createSelector(
  [selectMatch],
  (m) => m.currentHand.pot,
);
export const selectMatchLocation = createSelector(
  [selectMatch],
  (m) => m.general.matchLocation,
);

export const selectIsBettingPhase = createSelector(
  [selectCurrentPhase],
  (currentPhase) => {
    const p = currentPhase.phase.toLowerCase();
    return p === "bettingone" || p === "bettingtwo";
  },
);

export const selectCanAdvancePhase = createSelector([selectMatch], (match) =>
  canAdvancePhaseLogic(match),
);

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

export const selectActiveNPC = (state: RootState) => {
  const activeIdx = state.match.currentHand.activePlayerIndex;
  return state.match.currentHand.players[activeIdx];
};

export const selectActivePlayers = (state: RootState) =>
  state.match.currentHand.players.filter(
    (p) => !p.state.isFolded && !p.state.isAllIn,
  );
export const selectActivePlayerIndex = (state: RootState) =>
  state.match.currentHand.activePlayerIndex;
export const selectIsRoundOver = (state: RootState) => {
  const activeAndNotAllIn = state.match.currentHand.players.filter(
    (p) => !p.state.isFolded && !p.state.isAllIn,
  );

  const { currentBetOnTable, currentPhase } = state.match.currentHand;

  if (["ante", "deal", "showdown"].includes(currentPhase.phase)) return false;

  if (activeAndNotAllIn.length <= 1) {
    const activePlayers = state.match.currentHand.players.filter(
      (p) => !p.state.isFolded,
    );
    return activePlayers.every(
      (p) => p.state.currentBet === currentBetOnTable || p.state.isAllIn,
    );
  }

  const everyoneActed = activeAndNotAllIn.every((p) => p.state.hasActed);
  const betsEqual = activeAndNotAllIn.every(
    (p) => p.state.currentBet === currentBetOnTable,
  );

  return everyoneActed && betsEqual;
};

export const selectCurrentTurnPlayer = (state: RootState) =>
  state.match.currentHand.players[state.match.currentHand.activePlayerIndex];

export const selectIsHerosTurn = (state: RootState) => {
  const { players, activePlayerIndex } = state.match.currentHand;
  const currentPlayer = players[activePlayerIndex];

  return currentPlayer?.general.type === "human";
};

export const selectLastManStanding = createSelector(
  [selectPlayers],
  (players) => {
    const activePlayers = players.filter((p) => !p.state.isFolded);
    return activePlayers.length === 1 ? activePlayers[0] : null;
  },
);

export const selectIsGameOverByFold = createSelector(
  [selectLastManStanding],
  (lastMan) => lastMan !== null,
);
