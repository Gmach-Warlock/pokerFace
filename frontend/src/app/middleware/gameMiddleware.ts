import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import {
  advancePhase,
  checkAndRefillDeck,
  completeDrawPhase,
  dealCard,
  dealRound,
  processBet,
  resolveShowdown,
} from "../../features/match/matchSlice";
import type { RootState } from "../store/store";
import { getNPCAction } from "../logic/matchLogic";
import { processArenaAction } from "../../features/match/matchThunks";

import { selectPlayerHandEval } from "../../features/match/matchSelectors";

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
    if (
      advancePhase.match(action) &&
      currentPhase.phase.toLowerCase() === "deal"
    ) {
      listenerApi.dispatch(processArenaAction());
      return; // Exit here so we don't run NPC logic during a deal
    }
    if (
      currentPhase.phase === "notInGameYet" ||
      currentPhase.phase === "showdown"
    ) {
      return;
    }

    const activePlayers = players.filter(
      (p) => !p.currentMatch.isFolded && !p.currentMatch.isAllin,
    );

    if (activePlayers.length <= 1) return;

    const everyoneActed = activePlayers.every((p) => p.currentMatch.hasActed);
    const betsEqual = activePlayers.every(
      (p) => p.currentMatch.currentBet === currentBetOnTable,
    );

    if (everyoneActed && betsEqual) {
      if (isAnyOf(advancePhase, completeDrawPhase, dealRound)(action)) {
        return;
      }

      await listenerApi.delay(1000);
      listenerApi.dispatch(advancePhase());

      const newState = listenerApi.getState() as RootState;
      if (newState.match.currentPhase.phase === "showdown") {
        listenerApi.dispatch(resolveShowdown());
      }
      return;
    }

    if (activePlayerIndex === 0) return;

    const currentWaitPlayer = players[activePlayerIndex];

    if (
      currentWaitPlayer?.type === "computer" &&
      !currentWaitPlayer.currentMatch.hasActed
    ) {
      await listenerApi.delay(
        currentWaitPlayer.npcTraits?.general.thinkTime || 1000,
      );

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
        currentBetOnTable - (currentWaitPlayer.currentMatch.currentBet || 0),
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
