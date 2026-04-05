import { createAsyncThunk } from "@reduxjs/toolkit";

import { advancePhase, dealRound, markNpcDiscard } from "./matchSlice";
import type { RootState } from "../../app/store/store";
import { evaluatePokerHand, executeTurn } from "../../app/logic/matchLogic";
import { selectNpcDiscards } from "./matchSelectors";
import { logGameStep } from "../../functions/utils/utils";
import { processBet, resolveShowdown } from "./matchSlice";
import type { MatchInterface } from "../../app/interfaces/matchInterfaces";

export const processArenaAction = createAsyncThunk(
  "match/processArenaAction",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const match = state.match as MatchInterface;
    const { currentPhase, players, activePlayerIndex } = match;
    const matchType = match.matchType as string;
    const phase = currentPhase.phase.toLowerCase();

    logGameStep(`Processing ${matchType} - Phase: ${phase}`, state.match);

    // --- 5-CARD DRAW LOGIC ---
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
          const npcDiscards = selectNpcDiscards(state);
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

        case "bettingone":
        case "bettingtwo": {
          const currentPlayer = players[activePlayerIndex];

          // 1. NPC Turn Logic
          if (currentPlayer && currentPlayer.type === "computer") {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const evaluation = evaluatePokerHand(
              currentPlayer.currentMatch.currentHand,
            );
            const npcDecision = executeTurn(
              currentPlayer,
              evaluation,
              state.match,
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

          // 2. Universal Advance Check (Fixed the "Check/Call" hang)
          const activePlayers = players.filter((p) => !p.currentMatch.isFolded);
          const allActed = activePlayers.every((p) => p.currentMatch.hasActed);
          const betsEqual = activePlayers.every(
            (p) => p.currentMatch.currentBet === state.match.currentBetOnTable,
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

    // --- TEXAS HOLD'EM LOGIC (Future Gary) ---
    if (matchType === "holdem") {
      console.log("let's play some holdem");
    }

    if (matchType === "stud") {
      console.log("let's play 7 card stud");
    }
  },
);
