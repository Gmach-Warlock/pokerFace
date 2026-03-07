import { UseAppSelector } from "../../../app/hooks";
import "./Title.css";

export default function Title() {
  const Game = UseAppSelector((state) => state.game);

  return (
    <div className="title-container">
      <div className="title-container-card">
        <h1>Poker Face</h1>

        {Game.isPlaying ? (
          <form action="/">
            <label htmlFor="player-count-form">How many players?</label>
            <select name="player-count-form" id="player-count-form">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </form>
        ) : (
          <p className="text-shadow-cyan">Hit any button to continue</p>
        )}
      </div>
    </div>
  );
}
