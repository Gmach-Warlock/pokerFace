import { createSlice } from "@reduxjs/toolkit";
import { type PlayerInterface } from "../../app/types";
import { generateRandomString } from "../../functions/utils/utils";

export interface HeroInterface {
  numberOfPlayers: 1 | 2 | 3 | 4 | 5;
  homePlayer: PlayerInterface;
  opponents: PlayerInterface[];
}

const initialHeroState: HeroInterface = {
  numberOfPlayers: 1,
  homePlayer: {
    id: generateRandomString(8),
    name: "Player One",
    type: "human",
    cards: [],
    moneyTotal: 500,
    chips: {
      white: 25,
      red: 15,
      blue: 15,
      green: 10,
      black: 0,
    },
  },
  opponents: [],
};

const heroSlice = createSlice({
  name: "hero",
  initialState: initialHeroState,
  reducers: {},
});

export default heroSlice.reducer;
