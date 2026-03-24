import type { ChipColorType, ChipIconType } from "../../app/types";
import { pokerChips, chipValues } from "../../app/assets";
import "./Chip.css";

interface ChipProps {
  color: ChipColorType;
  icon: ChipIconType;
  value?: number;
}

export default function Chip({ color, icon }: ChipProps) {
  const chipSrc = pokerChips[color][icon];
  const chipValue = chipValues[color];

  return (
    <div>
      <img
        src={chipSrc}
        alt={`${color} poker chip worth ${chipValue}`}
        className="chip"
      />
    </div>
  );
}
