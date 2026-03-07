import Hand from "../Hand/Hand";
import "./Player.css";
import { type HandInterface } from "../../app/types";

export default function Player() {
  const hand: HandInterface = {
    type: "draw",
    cards: [
      {
        value: "A",
        suit: "spade",
        side: "face-up",
        currentLocation: "demo",
      },
      {
        value: "K",
        suit: "spade",
        side: "face-up",
        currentLocation: "demo",
      },
      {
        value: "Q",
        suit: "spade",
        side: "face-up",
        currentLocation: "demo",
      },
      {
        value: "J",
        suit: "spade",
        side: "face-up",
        currentLocation: "demo",
      },
      {
        value: 10,
        suit: "spade",
        side: "face-up",
        currentLocation: "demo",
      },
    ],
    hand: "tbd",
    currentLocation: "demo",
  };

  return (
    <div className="player-container">
      <Hand hand={hand} />
      <p>Player One</p>
    </div>
  );
}
