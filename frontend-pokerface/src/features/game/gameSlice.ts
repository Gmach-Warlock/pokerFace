import { createSlice } from "@reduxjs/toolkit";

interface GameInterface {
  isPlaying: boolean;
}

const initialGameState: GameInterface = {
  isPlaying: true,
};

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    startPlaying: (state) => {
      state.isPlaying = true;
    },
    quitPlaying: (state) => {
      state.isPlaying = false;
    },
  },
});

export const { startPlaying, quitPlaying } = gameSlice.actions;
export default gameSlice.reducer;
