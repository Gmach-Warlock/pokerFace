import { type PlayerInterface } from "../../../../../app/types";
import "./Opponent.css";
import Hand from "../../../../Hand/Hand";

interface OpponentPropsInterface {
  data: PlayerInterface;
}

export default function Opponent({ data }: OpponentPropsInterface) {
  // Logic: If they have no cards, show 5 face-down cards as a placeholder
  const handToRender =
    data.currentHand && data.currentHand.length > 0
      ? data.currentHand
      : Array(5).fill({
          value: "A",
          suit: "spade",
          side: "face-down",
          currentLocation: "demo",
        });

  return (
    <div className="opponent-card">
      <div className="opponent-info">
        <h3 className="opponent-name">{data.name}</h3>
        <p className="opponent-stats">${data.money}</p>
      </div>

      <div className="opponent-hand-wrapper">
        <Hand
          matchType="draw"
          cards={handToRender}
          currentLocation="demo"
          hand="tbd"
        />
      </div>
    </div>
  );
}
