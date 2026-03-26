import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AnteMap } from "../../app/assets";

interface ChipState {
  white: number;
  red: number;
  blue: number;
  green: number;
  black: number;
}

interface BettingState {
  pot: number;
  accounts: {
    [entityId: string]: {
      chips: ChipState;
      money: number;
    };
  };
}

const CHIP_VALUES = { white: 1, red: 5, blue: 10, green: 25, black: 100 };

const initialState: BettingState = {
  pot: 0,
  accounts: {}, // Hero and Opponents will be initialized here
};

export const bettingSlice = createSlice({
  name: "betting",
  initialState,
  reducers: {
    awardPot: (state, action: PayloadAction<{ winnerId: string }>) => {
      const account = state.accounts[action.payload.winnerId];
      if (account) {
        account.money += state.pot;
        state.pot = 0;
      }
    },
    placeBet: (
      state,
      action: PayloadAction<{ entityId: string; color: keyof ChipState }>,
    ) => {
      const { entityId, color } = action.payload;
      const account = state.accounts[entityId];
      const value = CHIP_VALUES[color];

      if (account && account.chips[color] > 0) {
        account.chips[color] -= 1;
        account.money -= value;
        state.pot += value;
      }
    },
    startNewHand: (
      state,
      action: PayloadAction<{ entityIds: string[]; location: string }>,
    ) => {
      const { entityIds, location } = action.payload;

      const anteAmount = AnteMap[location as keyof typeof AnteMap] || 1;

      state.pot = 0;

      console.log(entityIds, location);

      entityIds.forEach((id) => {
        const account = state.accounts[id];
        if (account && account.money >= anteAmount) {
          account.money -= anteAmount;
          state.pot += anteAmount;

          // Auto-deduct from the smallest chip (White)
          // In a more complex version, you'd calculate the best chip combo
          account.chips.white -= anteAmount;
        }
      });
    },
  },
});

export const { awardPot, placeBet, startNewHand } = bettingSlice.actions;
export default bettingSlice.reducer;
