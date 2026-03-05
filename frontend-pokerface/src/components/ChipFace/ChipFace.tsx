import { PokerChips } from "../../app/assets";
import type { ChipColorType } from "../../app/types";
import { createTextColor } from "../../functions/createTextColor";
import Logo from "./Logo/Logo";
import "./ChipFace.css";

export default function ChipFace() {
  const color: ChipColorType = "white";

  const createChipFace = (color: ChipColorType) => {
    switch (color) {
      case "red":
        return PokerChips.red.chipFaceDS;
      case "green":
        return PokerChips.green.chipFaceDS;
      case "blue":
        return PokerChips.blue.chipFaceDS;
      case "black":
        return PokerChips.black.chipFaceDS;
      case "white":
        return PokerChips.white.chipFaceDS;
    }
  };

  const correctChipColor = createChipFace(color);

  const correctTextColor = createTextColor(color);

  return (
    <div
      className={`chip-container flex-column align-items-center text-${correctTextColor} bg-${correctChipColor}`}
    >
      <div>
        <img
          src={correctChipColor}
          alt="black poker chip"
          className="chip-shadow-md"
        />
      </div>
      <div className="chip-logo align-self-center">
        <Logo color={correctChipColor} />
      </div>
    </div>
  );
}
