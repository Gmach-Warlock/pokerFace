import { createSlice } from "@reduxjs/toolkit";
import { type PlayerInterFace } from "../../app/types";

export interface PlayersInterface {
  numberOfPlayers: 1 | 2 | 3 | 4 | 5;
  players: PlayerInterFace[];
}

const initialPlayersState: PlayersInterface = {
  numberOfPlayers: 1,
  players: [
    {
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
  ],
};

const playersSlice = createSlice({
  name: "players",
  initialState: initialPlayersState,
  reducers: {},
});

export default playersSlice.reducer;
