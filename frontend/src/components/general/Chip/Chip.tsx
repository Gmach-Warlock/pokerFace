import type {
  ChipColorType,
  ChipIconType,
} from "../../../app/types/matchTypes";
import { chipValues, pokerChips } from "../../../app/assets/match/matchAssets";
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
