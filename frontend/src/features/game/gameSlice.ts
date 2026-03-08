import { createSlice } from "@reduxjs/toolkit";

interface GameInterface {
  isPlaying: boolean;
  currentlyDisplayed: "title" | "match" | "postGame" | "mainMenu" | "settings";
}

const initialGameState: GameInterface = {
  isPlaying: true,
  currentlyDisplayed: "mainMenu",
};

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {},
});

export default gameSlice.reducer;
