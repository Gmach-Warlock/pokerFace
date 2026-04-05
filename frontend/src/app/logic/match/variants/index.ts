import type { MatchType } from "../../../types/matchTypes";

export const getVariantLogic = (type: MatchType) => {
  const map = {
    draw: "drawRules",
    holdem: "holdemRules",
    stud: "studRules",
  };
  return map[type];
};
