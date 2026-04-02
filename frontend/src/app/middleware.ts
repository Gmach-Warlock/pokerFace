import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import {
  advancePhase,
  checkAndRefillDeck,
  completeDrawPhase,
  dealCard,
  dealRound,
  processBet,
  resolveShowdown,
} from "../features/match/matchSlice";
import type { RootState } from "./store";
import { getNPCAction } from "./logic/logic";

import { selectPlayerHandEval } from "../features/match/matchSelectors";

const deckListener = createListenerMiddleware();

// 2. Deck Management
deckListener.startListening({
  matcher: isAnyOf(dealCard, dealRound),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { deck } = state.match;
    if (deck.length < 15) {
      listenerApi.dispatch(checkAndRefillDeck());
    }
  },
});

// 2. GAME FLOW & NPC STRATEGY MANAGER
deckListener.startListening({
  matcher: isAnyOf(processBet, advancePhase, dealRound, completeDrawPhase),
  effect: async (action, listenerApi) => {
    // 1. Pull everything from state.match
    let state = listenerApi.getState() as RootState;
    const {
      activePlayerIndex,
      players,
      currentBetOnTable,
      currentPhase,
      difficultyLevel,
      pot,
    } = state.match;

    // 2. NEW GUARD: Only run if a match is actually active
    if (
      currentPhase.phase === "notInGameYet" ||
      currentPhase.phase === "showdown"
    ) {
      return;
    }

    // --- PHASE ADVANCEMENT LOGIC ---
    const activePlayers = players.filter((p) => !p.isFolded && !p.isAllin);

    // Safety check: if everyone folded, processBet handles it, so we exit here
    if (activePlayers.length <= 1) return;

    const everyoneActed = activePlayers.every((p) => p.hasActed);
    const betsEqual = activePlayers.every(
      (p) => p.currentBet === currentBetOnTable,
    );

    if (everyoneActed && betsEqual) {
      // Guard against infinite loops if the action was already a phase change
      if (isAnyOf(advancePhase, completeDrawPhase, dealRound)(action)) {
        return;
      }

      await listenerApi.delay(1000);
      listenerApi.dispatch(advancePhase());

      // Re-fetch to check if we just hit showdown
      const newState = listenerApi.getState() as RootState;
      if (newState.match.currentPhase.phase === "showdown") {
        listenerApi.dispatch(resolveShowdown());
      }
      return;
    }

    // --- NPC ACTION LOGIC ---
    if (activePlayerIndex === 0) return; // Hero's turn

    const currentWaitPlayer = players[activePlayerIndex];

    if (currentWaitPlayer?.type === "computer" && !currentWaitPlayer.hasActed) {
      await listenerApi.delay(
        currentWaitPlayer.npcTraits?.general.thinkTime || 1000,
      );

      // RE-FETCH STATE: Ensure it's still their turn after the delay
      state = listenerApi.getState() as RootState;
      if (state.match.activePlayerIndex !== activePlayerIndex) return;

      const evaluation = selectPlayerHandEval(state, activePlayerIndex);

      const decision = getNPCAction(
        currentWaitPlayer,
        evaluation,
        difficultyLevel,
        pot,
        currentBetOnTable,
      );

      const amountToCall = Math.max(
        0,
        currentBetOnTable - (currentWaitPlayer.currentBet || 0),
      );

      let amountToSend = 0;
      if (decision === "call") amountToSend = amountToCall;
      else if (decision === "raise") amountToSend = amountToCall + 20;

      const finalType =
        decision === "fold" && amountToCall === 0 ? "check" : decision;

      listenerApi.dispatch(
        processBet({
          playerId: currentWaitPlayer.id ?? "",
          type: finalType,
          amount: amountToSend,
        }),
      );
    }
  },
});

export default deckListener;
