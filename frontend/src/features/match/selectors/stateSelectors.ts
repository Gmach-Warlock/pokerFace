import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store/store";
import { canAdvancePhaseLogic } from "../../../app/logic/match/utils/stateUtils";
import {
  selectHerosId,
  selectHeroHand,
  selectHeroAmountToCall,
  selectHeroMoney,
} from "./heroSelectors";
import { selectPlayerName, selectPlayers } from "./playerSelectors";

export const selectMatch = (state: RootState) => state.match;

export const selectCurrentPhaseName = (state: RootState) =>
  state.match.currentHand.currentPhase.phase;

// 2. Use this for components that need the type AND phase (like ArenaCenter)
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
export const selectDeckStyle = createSelector(
  [selectMatch],
  (m) => m.general.deckStyle,
);

export const selectIsBettingPhase = createSelector(
  [selectCurrentPhase],
  (currentPhase) => {
    const p = currentPhase.phase.toLowerCase();
    return p === "bettingone" || p === "bettingtwo";
  },
);
export const selectIsPlaying = (state: RootState) => state.game.isPlaying;
export const selectCurrentMaxBet = createSelector([selectMatch], (match) => {
  const allBets = match.currentHand.players.map((p) => p.state.currentBet ?? 0);
  return Math.max(...allBets, 0);
});

export const selectCanAdvancePhase = createSelector([selectMatch], (match) =>
  canAdvancePhaseLogic(match),
);

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
    // 1. Phase names are case-sensitive. Let's force lowercase for comparison
    // to avoid "bettingOne" vs "bettingone" bugs.
    const p = currentPhase.phase.toLowerCase();

    switch (p) {
      case "ante":
        return "Ante Up & Deal";
      case "deal":
        // This is where you were getting stuck.
        // If the cards are dealt but the phase hasn't advanced yet:
        return "Start Betting";
      case "draw":
        return discardCount > 0 ? `Swap ${discardCount} Cards` : "Stand Pat";
      case "bettingone":
      case "bettingtwo":
        return amountToCall > 0 ? `Call $${amountToCall}` : "Check";
      case "showdown":
        return "See Results";
      default:
        // Use a more descriptive fallback for debugging
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

  // If 0 or 1 person can still act, the round is essentially over
  if (activeAndNotAllIn.length <= 1) {
    // Check if everyone else has matched the current bet on table
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

  // Checking by type is safer than index 0 if you ever
  // decide to move the hero's position in the array
  return currentPlayer?.general.type === "human";
};

export const selectLastManStanding = createSelector(
  [selectPlayers],
  (players) => {
    const activePlayers = players.filter((p) => !p.state.isFolded);
    // Return the single player if they are the only one left, otherwise null
    return activePlayers.length === 1 ? activePlayers[0] : null;
  },
);

// 2. Helper to check if the match should end immediately due to folds
export const selectIsGameOverByFold = createSelector(
  [selectLastManStanding],
  (lastMan) => lastMan !== null,
);
