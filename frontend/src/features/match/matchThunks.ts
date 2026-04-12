import { createAsyncThunk } from "@reduxjs/toolkit";

import { dealRound, markNpcDiscard } from "./matchSlice";
import type { RootState } from "../../app/store/store";
import { evaluatePokerHand } from "../../app/logic/match/evaluators/evaluators";
import {
  executeTurn,
  getNPCDiscardDecision,
} from "../../app/logic/match/utils/utils";
import { handleBet } from "./matchSlice";
import {
  selectMatch,
  selectCurrentPhaseName,
  selectCurrentTurnPlayer,
} from "./selectors/stateSelectors";
import type { PlayerInterface } from "../../app/interfaces/matchInterfaces";

export const processArenaAction = createAsyncThunk(
  "match/processArenaAction",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const match = selectMatch(state);
    const phase = selectCurrentPhaseName(state);
    const currentPlayer = selectCurrentTurnPlayer(state);

    switch (phase) {
      case "ante":
      case "deal":
        dispatch(dealRound());
        return;

      case "draw":
        match.currentHand.players.forEach(
          (player: PlayerInterface, idx: number) => {
            if (player.general.type === "computer" && !player.state.isFolded) {
              const indices = getNPCDiscardDecision(player);
              dispatch(
                markNpcDiscard({ playerIndex: idx, cardIndices: indices }),
              );
            }
          },
        );
        dispatch(dealRound());
        return;

      case "bettingOne":
      case "bettingTwo":
        if (
          currentPlayer?.general.type === "computer" &&
          !currentPlayer.state.isFolded
        ) {
          const evaluation = evaluatePokerHand(currentPlayer.state.hand);
          const npcDecision = executeTurn(currentPlayer, evaluation, match);

          dispatch(
            handleBet({
              playerId: currentPlayer.general.id ?? "unknown",
              amount: npcDecision.amount,
              type: npcDecision.type,
            }),
          );
        }
        return;

      case "showdown":
        // You can add logic here to trigger winner animations/calculations
        return;
    }
  },
);
