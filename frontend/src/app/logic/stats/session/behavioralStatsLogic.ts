import type { PokerChoiceType } from "../../../types/matchTypes";
import type { SessionStatsInterface } from "../../../interfaces/profileInterfaces";

export const checkVPIP = (actions: PokerChoiceType[]): boolean => {
  const voluntaryActions: PokerChoiceType[] = ["call", "raise"];
  return actions.some((action) => voluntaryActions.includes(action));
};

export const checkPFR = (
  handHistory: { action: PokerChoiceType; phase: string }[],
): boolean => {
  return handHistory.some(
    (h) =>
      (h.phase === "preflop" || h.phase === "bettingOne") &&
      h.action === "raise",
  );
};

export const updateHandBehavior = (
  currentSession: SessionStatsInterface,
  summary: {
    didVPIP: boolean;
    didPFR: boolean;
    wasBluff: boolean;
    bluffSucceeded: boolean;
  },
): SessionStatsInterface => {
  return {
    ...currentSession,
    activity: {
      ...currentSession.activity,
      vpipCount: summary.didVPIP
        ? currentSession.activity.vpipCount + 1
        : currentSession.activity.vpipCount,
      pfrCount: summary.didPFR
        ? currentSession.activity.pfrCount + 1
        : currentSession.activity.pfrCount,
      bluffsAttempted: summary.wasBluff
        ? currentSession.activity.bluffsAttempted + 1
        : currentSession.activity.bluffsAttempted,
      bluffsSucceeded: summary.bluffSucceeded
        ? currentSession.activity.bluffsSucceeded + 1
        : currentSession.activity.bluffsSucceeded,
    },
  };
};
