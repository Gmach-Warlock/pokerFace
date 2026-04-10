import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import {
  advancePhase,
  checkAndRefillDeck,
  dealCard,
  dealRound,
  handleBet,
} from "../../features/match/matchSlice";
import type { RootState } from "../store/store";
import { processArenaAction } from "../../features/match/matchThunks";

const deckListener = createListenerMiddleware();

deckListener.startListening({
  matcher: isAnyOf(dealCard, dealRound),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    if (state.match.currentHand.deck.length < 15) {
      listenerApi.dispatch(checkAndRefillDeck());
    }
  },
});

deckListener.startListening({
  matcher: isAnyOf(handleBet, advancePhase),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { players, currentBetOnTable, currentPhase, activePlayerIndex } =
      state.match.currentHand;
    const phase = currentPhase.phase;
    const currentPlayer = players[activePlayerIndex];

    // 1. SYSTEM PHASES: (Ante, Deal, Draw)
    // These phases require automation regardless of who the 'activePlayer' is.
    const isSystemPhase = ["ante", "deal", "draw"].includes(phase);

    if (isSystemPhase) {
      console.log(
        `MIDDLEWARE: System Phase [${phase}] automation triggering...`,
      );
      await listenerApi.delay(1000);
      listenerApi.dispatch(processArenaAction());
      return; // Exit here; don't run betting logic
    }

    // 2. BETTING PHASES: (Wait for Human)
    if (phase.includes("betting")) {
      // Use the 'as string' trick to bypass the TS error
      if ((currentPlayer?.general.type as string) === "human") {
        console.log("MIDDLEWARE: Betting Phase - Waiting for Hero.");
        return;
      }

      // Check for Round Completion
      const activePlayers = players.filter((p) => !p.state.isFolded);
      const everyoneActed = activePlayers.every((p) => p.state.hasActed);
      const betsEqual = activePlayers.every(
        (p) => p.state.currentBet === currentBetOnTable,
      );

      // If the round isn't over yet, we handle the current turn
      if (!everyoneActed || !betsEqual) {
        if ((currentPlayer?.general.type as string) === "human") {
          console.log(
            "MIDDLEWARE: Hero turn detected. Waiting for player input...",
          );
          return; // STOP HERE. Do not advance, do not call thunk.
        }

        if (
          (currentPlayer?.general.type as string) === "computer" &&
          !currentPlayer.state.hasActed
        ) {
          console.log(
            `MIDDLEWARE: NPC ${currentPlayer.general.name} is thinking...`,
          );
          await listenerApi.delay(1200);
          listenerApi.dispatch(processArenaAction());
          return;
        }
      }

      // ONLY if the round is actually finished, we advance
      if (everyoneActed && betsEqual) {
        if (action.type !== advancePhase.type) {
          console.log("!!! Round complete. Advancing Phase !!!");
          await listenerApi.delay(1000);
          listenerApi.dispatch(advancePhase());
        }
      }
    }
  },
});

export default deckListener;
