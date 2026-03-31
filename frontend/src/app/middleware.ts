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
    const { deck } = state.game.currentMatch;
    if (deck.length < 15) {
      listenerApi.dispatch(checkAndRefillDeck());
    }
  },
});

// 2. GAME FLOW & NPC STRATEGY MANAGER
deckListener.startListening({
  matcher: isAnyOf(processBet, advancePhase, dealRound, completeDrawPhase),
  effect: async (action, listenerApi) => {
    // Get fresh state at the start of the effect
    let state = listenerApi.getState() as RootState;
    const { currentMatch, currentlyDisplayed } = state.game;
    const { activePlayerIndex, players, currentBetOnTable, currentPhase } =
      currentMatch;

    if (currentlyDisplayed !== "match") return;

    // --- PHASE ADVANCEMENT LOGIC ---
    const activePlayers = players.filter((p) => !p.isFolded && !p.isAllin);
    const everyoneActed = activePlayers.every((p) => p.hasActed);
    const betsEqual = activePlayers.every(
      (p) => p.currentBet === currentBetOnTable,
    );

    if (everyoneActed && betsEqual && currentPhase.phase !== "showdown") {
      // Use isAnyOf as a type guard to check the action
      // This removes the "string is not assignable" error completely
      if (isAnyOf(advancePhase, completeDrawPhase, dealRound)(action)) {
        return;
      }

      await listenerApi.delay(1000);
      listenerApi.dispatch(advancePhase());

      const newState = listenerApi.getState() as RootState;
      if (newState.game.currentMatch.currentPhase.phase === "showdown") {
        listenerApi.dispatch(resolveShowdown());
      }
      return;
    }

    // --- NPC ACTION LOGIC ---
    console.log("Checking NPC turn for index:", activePlayerIndex);
    if (activePlayerIndex === 0) {
      console.log("Exiting: It's the Hero's turn.");
      return;
    }

    const currentWaitPlayer = players[activePlayerIndex];

    if (currentWaitPlayer?.type === "computer" && !currentWaitPlayer.hasActed) {
      await listenerApi.delay(
        currentWaitPlayer.npcTraits?.general.thinkTime || 1000,
      );

      // RE-FETCH STATE: Ensure it's still their turn after the delay
      state = listenerApi.getState() as RootState;
      if (state.game.currentMatch.activePlayerIndex !== activePlayerIndex)
        return;

      const evaluation = selectPlayerHandEval(state, activePlayerIndex);

      const decision = getNPCAction(
        currentWaitPlayer,
        evaluation,
        state.game.currentMatch.difficultyLevel,
        state.game.currentMatch.pot,
        currentBetOnTable,
      );

      const amountToCall = Math.max(
        0,
        currentBetOnTable - (currentWaitPlayer.currentBet || 0),
      );
      let amountToSend = 0;

      if (decision === "call") amountToSend = amountToCall;
      else if (decision === "raise") amountToSend = amountToCall + 20;

      // Force check if folding is free
      const finalType =
        decision === "fold" && amountToCall === 0 ? "check" : decision;
      console.log(`final type ${finalType} decision is ${decision}`);
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
