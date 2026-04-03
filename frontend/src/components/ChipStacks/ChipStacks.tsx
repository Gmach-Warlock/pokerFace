import "./ChipStacks.css";
import Chip from "../Chip/Chip";
import type { ChipColorType } from "../../app/types/matchTypes";

interface ChipStacksPropsInterface {
  white: number;
  red: number;
  blue: number;
  green: number;
  black: number;
}

export default function ChipStacks({
  white,
  red,
  blue,
  green,
  black,
}: ChipStacksPropsInterface) {
  const renderColorStacks = (total: number, color: ChipColorType) => {
    const numStacks = Math.ceil(total / 20);

    return Array.from({ length: numStacks }).map((_, stackIndex) => {
      const chipsInThisStack = Math.min(20, total - stackIndex * 20);

      return (
        <div
          className={`stack stack--${color}`}
          key={`${color}-stack-${stackIndex}`}
        >
          {Array.from({ length: chipsInThisStack }).map((_, chipIndex) => (
            <Chip
              key={`${color}-${stackIndex}-${chipIndex}`}
              color={color}
              icon="side"
            />
          ))}
        </div>
      );
    });
  };

  return (
    <div className="stacks">
      {renderColorStacks(black, "black")}
      {renderColorStacks(green, "green")}
      {renderColorStacks(blue, "blue")}
      {renderColorStacks(red, "red")}
      {renderColorStacks(white, "white")}
    </div>
  );
}
