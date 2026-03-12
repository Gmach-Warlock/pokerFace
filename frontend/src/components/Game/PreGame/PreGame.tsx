import "./PreGame.css";

export default function PreGame() {
  return (
    <>
      <div className="preGame-menu">
        <h2>Match Info</h2>
        <form action="/">
          <div className="numOfOpponents setting">
            <div>
              <span>How many Opponents?</span>
            </div>
            <div>
              <select
                name="opponentNumber"
                id="opponentNumber"
                title="opponentNumber"
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
          <div className="deck-style setting">
            <div>
              <span>Which deck style do you want to use?</span>
            </div>
            <div>
              <select name="deck-style" id="deck-style" title="deck-style">
                <option value="arrowBolt">Arrow Bolt</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
        </form>
      </div>
      <div className="matchStartButton">
        <button type="submit" title="match start button">
          Start Match
        </button>
      </div>
    </>
  );
}
