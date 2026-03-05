import { PokerChips } from "../../app/assets";
import "./ChipSide.css";

export default function ChipSide() {
  return (
    <div>
      <img
        src={PokerChips.black.chipSideDS}
        alt="black chip"
        className="chip-side-md"
      />
    </div>
  );
}
