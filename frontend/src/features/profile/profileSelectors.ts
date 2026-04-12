import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store/store";
import { calculateXpProgress } from "../../app/logic/profile/profileLogic";
import { selectHero } from "../match/selectors/heroSelectors";
const selectProfileState = (state: RootState) => state.authorize;

export const selectPlayerData = createSelector(
  [selectProfileState],
  (profile) => profile.playerData,
);

export const selectProfileMeta = createSelector(
  [selectProfileState],
  (profile) => profile.meta,
);

export const selectXpStats = createSelector(
  [selectPlayerData],
  (playerData) => {
    // Narrowing the type here:
    if (!playerData.profile) return { xpRemaining: 0, progressPercentage: 0 };

    return calculateXpProgress(playerData.profile.xp);
  },
);

export const selectUsername = createSelector(
  [selectProfileMeta],
  (meta) => meta.username,
);

export const selectCurrentPlei = createSelector(
  [selectPlayerData],
  (playerData) => playerData.profile?.plei ?? 0,
);

export const selectProfileData = createSelector(
  [(state: RootState) => state.profile.playerData],
  (playerData) => {
    return (
      playerData.profile ?? {
        level: 1,
        xp: 0,
        nextLevel: 5,
        plei: 0,
        availableLocations: [],
        availableDecks: [],
        locationsVisited: [],
        locationsMastered: [],
        stats: { lifetime: {} },
        achievements: [],
      }
    );
  },
);
export const selectInitialHeroProfileState = (state: RootState) =>
  state.profile.playerData;

export const selectHeroXpProgress = createSelector([selectHero], (hero) => {
  if (!hero) return 0;
  return (hero.profile.xp / hero.profile.nextLevel) * 100;
});
