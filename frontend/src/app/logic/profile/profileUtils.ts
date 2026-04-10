import { LEVEL_THRESHOLDS } from "../../assets/profile/xpAssets";
import type { PlayerInterface } from "../../interfaces/matchInterfaces";

export const awardXp = (player: PlayerInterface, amount: number) => {
  if (!player.profile) return;

  const MAX_LEVEL = LEVEL_THRESHOLDS.length + 1; // e.g., 11 if you have 10 thresholds
  if (player.profile.level >= MAX_LEVEL) return;

  // 1. Add the XP to the running total
  player.profile.xp += amount;

  // 2. Level Cycling: Check if the new Total XP qualifies for multiple level-ups
  // We use a while loop in case a "Fat Reward" jumps them up 2+ levels at once

  // Note: Threshold for Level 2 is at index 0, Level 3 at index 1, etc.
  let nextLevelThreshold = LEVEL_THRESHOLDS[player.profile.level - 1];

  while (
    nextLevelThreshold !== undefined &&
    player.profile.xp >= nextLevelThreshold &&
    player.profile.level < MAX_LEVEL
  ) {
    // DO NOT subtract XP anymore. The total just keeps growing.
    player.profile.level += 1;

    // Update threshold for the NEXT potential level-up in the loop
    nextLevelThreshold = LEVEL_THRESHOLDS[player.profile.level - 1];

    console.log(`LEVEL UP! Gary is now Level ${player.profile.level}`);
    // Trigger any "Unlock" toast or sound effects here
  }
};
