import { createAsyncThunk } from "@reduxjs/toolkit";

import { advancePhase, dealRound, markNpcDiscard } from "./matchSlice";
import type { RootState } from "../../app/store/store";
import { evaluatePokerHand } from "../../app/logic/match/evaluators/evaluators";
import { executeTurn, logGameStep } from "../../app/logic/match/utils/utils";
import { selectNpcDiscards } from "./matchSelectors";
import { processBet, resolveShowdown } from "./matchSlice";
import { logBettingState } from "../../app/logic/match/debuggers/matchDebuggers";

export const processArenaAction = createAsyncThunk(
  "match/processArenaAction",
  async (_, { getState, dispatch }) => {
    // 1. Get initial snapshot
    const initialState = getState() as RootState;
    const matchType = initialState.match.matchType as string;
    const phase = initialState.match.currentPhase.phase.toLowerCase();
    const activePlayerIndex = initialState.match.activePlayerIndex;
    const players = initialState.match.players;

    logGameStep(
      `Processing ${matchType} - Phase: ${phase}`,
      initialState.match,
    );
    console.log("DEBUG: Thunk is running for phase:", phase); // <--- ADD THIS

    if (matchType === "draw") {
      switch (phase) {
        case "notingameyet":
        case "ante":
          dispatch(advancePhase());
          dispatch(dealRound());
          break;

        case "deal":
          await new Promise((resolve) => setTimeout(resolve, 1500));
          dispatch(advancePhase());
          break;

        case "draw": {
          const npcDiscards = selectNpcDiscards(initialState);
          npcDiscards.forEach((indices, idx) => {
            if (idx > 0)
              dispatch(
                markNpcDiscard({ playerIndex: idx, cardIndices: indices }),
              );
          });
          dispatch(dealRound());
          dispatch(advancePhase());
          break;
        }

        case "bettingOne":
        case "bettingTwo": {
          const latestState = getState() as RootState;
          const currentPlayer = players[activePlayerIndex];
          logBettingState("Before Advance Check", latestState.match);
          console.log("testing one two three");

          // 1. NPC Turn Logic
          if (currentPlayer && currentPlayer.type === "computer") {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const evaluation = evaluatePokerHand(
              currentPlayer.currentMatch.currentHand,
            );
            const npcDecision = executeTurn(
              currentPlayer,
              evaluation,
              initialState.match,
            );

            dispatch(
              processBet({
                playerId: npcDecision.playerId ?? "unknown",
                amount: npcDecision.amount,
                type: npcDecision.type,
              }),
            );
            return;
          }

          const activePlayers = players.filter((p) => !p.currentMatch.isFolded);
          const allActed = activePlayers.every((p) => p.currentMatch.hasActed);
          const currentBetOnTable = initialState.match.currentBetOnTable;

          // Use the currentBetOnTable from the LATEST state
          const betsEqual = activePlayers.every(
            (p) => p.currentMatch.currentBet === currentBetOnTable,
          );

          if (allActed && betsEqual) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            dispatch(advancePhase());
          }
          break;
        }

        case "showdown":
          await new Promise((resolve) => setTimeout(resolve, 2000));
          dispatch(resolveShowdown());
          break;

        default:
          break;
      }
    }
  },
);
