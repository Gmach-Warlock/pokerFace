import {
  createListenerMiddleware,
  isAnyOf,
  createSelector,
} from "@reduxjs/toolkit";
import {
  advancePhase,
  dealRound,
  dealCard,
  checkAndRefillDeck,
  completeDrawPhase,
  processBet,
  resolveShowdown,
} from "../features/game/gameSlice";
import type { RootState } from "./store";
import { evaluateHand, getNPCAction } from "./logic/logic";
import type { BettingActionType } from "./types";

const deckListener = createListenerMiddleware();

// 1. Memoized Evaluation: Now points to the 'players' array
export const selectPlayerHandEval = createSelector(
  [
    (state: RootState) => state.game.currentMatch.players,
    (_state: RootState, index: number) => index,
  ],
  (players, index) => {
    const hand = players[index]?.currentHand || [];
    return evaluateHand(hand);
  },
);

// 2. Deck Management
deckListener.startListening({
  matcher: isAnyOf(dealCard, dealRound),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { deck } = state.game.currentMatch;
    if (deck.length < 15) {
      listenerApi.dispatch(checkAndRefillDeck());
    }
  },
});

// 3. GAME FLOW & NPC STRATEGY MANAGER
// 3. GAME FLOW & NPC STRATEGY MANAGER
deckListener.startListening({
  matcher: isAnyOf(processBet, advancePhase, dealRound, completeDrawPhase),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { activePlayerIndex, players, currentBet, currentPhase } =
      state.game.currentMatch;

    // --- 1. THE PLAYER CONTROL GUARD ---
    // If it's a phase that requires Hero input and it's the Hero's turn, we STOP.
    const isManualPhase = ["bettingOne", "bettingTwo", "draw"].includes(
      currentPhase.phase,
    );
    if (isManualPhase && activePlayerIndex === 0) {
      return;
    }

    // --- 2. PHASE ADVANCEMENT & SHOWDOWN TRIGGER ---
    const activePlayers = players.filter((p) => !p.isFolded && !p.isAllin);
    const everyoneActed = activePlayers.every((p) => p.hasActed);
    const betsEqual = activePlayers.every((p) => p.currentBet === currentBet);

    if (everyoneActed && betsEqual && currentPhase.phase !== "showdown") {
      // Safety: If the action that triggered this was already a phase change,
      // don't double-advance. This prevents skipping rounds.
      if (
        action.type === advancePhase.type ||
        action.type === completeDrawPhase.type ||
        action.type === dealRound.type
      ) {
        return;
      }

      await listenerApi.delay(1000);
      listenerApi.dispatch(advancePhase());

      // CRITICAL: Check the NEW state immediately after advancing
      const newState = listenerApi.getState() as RootState;
      if (newState.game.currentMatch.currentPhase.phase === "showdown") {
        // This triggers the calculation and the winning message
        listenerApi.dispatch(resolveShowdown());
      }
      return;
    }

    // --- 3. NPC ACTION LOGIC ---
    const currentWaitPlayer = players[activePlayerIndex];

    // Only run if it's a computer's turn and they haven't moved yet
    if (
      currentWaitPlayer &&
      currentWaitPlayer.type === "computer" &&
      !currentWaitPlayer.hasActed
    ) {
      await listenerApi.delay(currentWaitPlayer.personality?.thinkTime || 1000);

      const evaluation = selectPlayerHandEval(state, activePlayerIndex);
      const decision = getNPCAction(
        currentWaitPlayer,
        evaluation,
        state.game.currentMatch.difficultyLevel,
        state.game.currentMatch.pot,
        currentBet,
      );

      const type = decision as BettingActionType;

      let amountToSend = 0;
      if (type === "call") {
        amountToSend = Math.max(
          0,
          currentBet - (currentWaitPlayer.currentBet || 0),
        );
      } else if (type === "raise") {
        // Raise current table bet by 50
        amountToSend = currentBet + 50 - (currentWaitPlayer.currentBet || 0);
      }

      listenerApi.dispatch(
        processBet({
          playerId: currentWaitPlayer.id ?? "unknown",
          type,
          amount: amountToSend,
        }),
      );
    }
  },
});

export default deckListener;
