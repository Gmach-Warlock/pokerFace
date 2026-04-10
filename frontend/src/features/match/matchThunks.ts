import { createAsyncThunk } from "@reduxjs/toolkit";

import { advancePhase, dealRound, markNpcDiscard } from "./matchSlice";
import type { RootState } from "../../app/store/store";
import { evaluatePokerHand } from "../../app/logic/match/evaluators/evaluators";
import {
  executeTurn,
  getNPCDiscardDecision,
} from "../../app/logic/match/utils/utils";
import { handleBet } from "./matchSlice";
import type { MatchInterface } from "../../app/interfaces/matchInterfaces";

export const processArenaAction = createAsyncThunk(
  "match/processArenaAction",
  async (_, { getState, dispatch }) => {
    // 1. Fresh state grab
    const state = (getState() as RootState).match as MatchInterface;
    const { activePlayerIndex, players, isRoundTransitioning } =
      state.currentHand;
    const { matchType } = state.general;
    const currentPhase = state.currentHand.currentPhase.phase;

    // 2. REGULATION: Check if the Reducer signaled a Phase Change
    if (isRoundTransitioning) {
      console.log(`Round transition detected at ${currentPhase}. Advancing...`);

      // Dramatic pause so the user sees the final call/fold
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // This action must reset isRoundTransitioning to false
      dispatch(advancePhase());
      return; // Exit thunk; the next cycle will handle the new phase
    }

    // 3. GAME LOGIC: Handle specific game types (e.g., Draw Poker)
    if (matchType === "draw") {
      switch (currentPhase) {
        case "notInGameYet":
        case "ante":
          dispatch(dealRound());
          // Note: In your slice, dealRound or a follow-up should trigger the phase advance
          break;

        case "deal":
          dispatch(dealRound());
          // If dealRound is async/animated, we wait here
          await new Promise((resolve) => setTimeout(resolve, 1500));
          dispatch(advancePhase());
          break;

        case "draw": {
          // NPC Discard Logic
          players.forEach((player, idx) => {
            if (player.general.type === "computer" && !player.state.isFolded) {
              const indices = getNPCDiscardDecision(player); // Pass the specific player
              dispatch(
                markNpcDiscard({ playerIndex: idx, cardIndices: indices }),
              );
            }
          });
          dispatch(dealRound());
          break;
        }

        case "bettingOne":
        case "bettingTwo": {
          const currentPlayer = players[activePlayerIndex];

          // 4. NPC TURN REGULATION
          if (
            currentPlayer &&
            currentPlayer.general.type === "computer" &&
            !currentPlayer.state.isFolded
          ) {
            // "Thinking" delay
            await new Promise((resolve) => setTimeout(resolve, 1200));

            const evaluation = evaluatePokerHand(currentPlayer.state.hand);
            const npcDecision = executeTurn(currentPlayer, evaluation, state);

            dispatch(
              handleBet({
                playerId: currentPlayer.general.id ?? "unknown",
                amount: npcDecision.amount,
                type: npcDecision.type,
              }),
            );
          }
          break;
        }
      }
    }
  },
);
