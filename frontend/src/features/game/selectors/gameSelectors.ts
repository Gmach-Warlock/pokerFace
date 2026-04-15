import type { RootState } from "../../../app/store/store";

export const selectIsPlaying = (state: RootState) => state.game.isPlaying;
