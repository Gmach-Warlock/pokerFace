import { type ChipColorType } from "../app/types";

export const createTextColor = (color: ChipColorType) => {
  if (color === "white") {
    return "blue";
  } else {
    return "white";
  }
};
