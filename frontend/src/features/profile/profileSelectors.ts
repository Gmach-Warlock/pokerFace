import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store/store";
import { calculateXpProgress } from "../../functions/utils/profile";

const selectProfileState = (state: RootState) => state.authorize;

// 2. Focused Selectors (Tracing into the nests)
export const selectPlayerData = createSelector(
  [selectProfileState],
  (profile) => profile.playerData,
);

export const selectProfileMeta = createSelector(
  [selectProfileState],
  (profile) => profile.meta,
);

// 3. Derived Selector (The "Smart" one)
// This automatically calculates your HUD data whenever XP changes
export const selectXpStats = createSelector(
  [selectPlayerData],
  (playerData) => {
    // Narrowing the type here:
    if (!playerData.profile) return { xpRemaining: 0, progressPercentage: 0 };

    // Now TypeScript knows playerData.profile exists!
    // No more red squiggly lines on 'xp'.
    return calculateXpProgress(playerData.profile.xp);
  },
);

// 4. Convenience Selectors
export const selectUsername = createSelector(
  [selectProfileMeta],
  (meta) => meta.username,
);

export const selectCurrentPlei = createSelector(
  [selectPlayerData],
  (playerData) => playerData.profile?.plei ?? 0,
);

export const selectProfileData = createSelector(
  [selectPlayerData],
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
        stats: { lifetime: {} as string[] },
        achievements: [],
      }
    );
  },
);
export const selectInitialHeroProfileState = (state: RootState) =>
  state.profile.playerData;
