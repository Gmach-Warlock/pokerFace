import "./PreGame.css";

export default function PreGame() {
  return (
    <div className="preGame-container">
      {" "}
      {/* New wrapper for layout */}
      <div className="preGame-menu">
        <h2 className="menu-title">Match Info</h2>

        <form action="/" className="preGame-form">
          <div className="setting">
            <label htmlFor="opponentNumber">How many Opponents?</label>
            <select name="opponentNumber" id="opponentNumber">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="setting">
            <label htmlFor="deck-style">
              Which deck style do you want to use?
            </label>
            <select name="deck-style" id="deck-style">
              <option value="arrowBolt">Arrow Bolt</option>
              <option value="classic">Classic</option>
              <option value="neon">Neon</option>
            </select>
          </div>

          {/* Button is now INSIDE the form */}
          <div className="matchStartButton">
            <button type="submit">Start Match</button>
          </div>
        </form>
      </div>
    </div>
  );
}
