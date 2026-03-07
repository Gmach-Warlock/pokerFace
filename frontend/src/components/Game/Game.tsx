import "./Game.css";
import Hand from "../Hand/Hand";

export default function Game() {
  return (
    <div className="game-container">
      <div className="game-container-card">
        <h1>Poker Face</h1>

        <p className="text-shadow-cyan">Hit any button to continue</p>

        <Hand />
      </div>
    </div>
  );
}
