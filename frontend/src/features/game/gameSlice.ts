import { createSlice } from "@reduxjs/toolkit";

interface GameInterface {
  isPlaying: boolean;
  currentlyDisplayed: "title" | "match" | "postGame" | "mainmenu" | "settings";
}

const initialGameState: GameInterface = {
  isPlaying: true,
  currentlyDisplayed: "mainmenu",
};

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {},
});

export default gameSlice.reducer;
