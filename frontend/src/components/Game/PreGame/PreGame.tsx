import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { startMatch } from "../../../features/game/gameSlice";
import type {
  NumberOfOpponentsType,
  DifficultyType,
  MatchLocationType,
} from "../../../app/types";
import "./PreGame.css";
import { useNavigate } from "react-router";

export default function PreGame() {
  const playerData = useAppSelector((state) => state.profile.playerData);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formatOptionText = (text: string) => {
    return text
      .split("-") // Split "low-vault-lounge" into ["low", "vault", "lounge"]
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // ["Low", "Vault", "Lounge"]
      .join(" "); // "Low Vault Lounge"
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const opponents = Number(
      formData.get("opponentNumber"),
    ) as NumberOfOpponentsType;
    const difficulty = formData.get("difficulty-level") as DifficultyType;
    const location = formData.get("match-area-select") as MatchLocationType;
    dispatch(
      startMatch({
        numberOfOpponents: opponents,
        levelOfDifficulty: difficulty,
        matchLocation: location,
      }),
    );
    navigate(`/game/match/${location}`);
  };

  return (
    <div className="preGame-container">
      {" "}
      <div className="preGame-menu">
        <h2 className="menu-title">Match Info</h2>

        <form action="#" className="preGame-form" onSubmit={handleSubmit}>
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
              {playerData.availableDecks.map((item, index) => (
                <option key={`${item}${index}`} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="setting">
            <label htmlFor="difficulty-level">
              Choose your level of difficulty
            </label>
            <select
              name="difficulty-level"
              id="difficulty-level"
              title="difficulty-level"
            >
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="difficult">Difficult</option>
            </select>
          </div>

          <div className="setting">
            <label htmlFor="match-area-select">
              Where do you want to play at?
            </label>
            <select
              name="match-area-select"
              id="match-area-select"
              title="match-area-select"
            >
              {playerData.availableLocations.map((area, index) => (
                <option
                  key={area + index}
                  value={area}
                >{`The ${formatOptionText(area.trim())}`}</option>
              ))}
            </select>
          </div>

          <div className="matchStartButton">
            <button type="submit">Start Match</button>
          </div>
        </form>
      </div>
    </div>
  );
}
