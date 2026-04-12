import { Outlet, useNavigate } from "react-router";
import "./MatchContainer.css";
import { useAppSelector } from "../../../app/hooks/gameHooks";
import { useEffect } from "react";
import PhaseAlert from "./PhaseAlert/PhaseAlert";
import WinnerOverlay from "./MatchResultsOverlay/MatchResultsOverlay";
import { selectOpponents } from "../../../features/match/selectors/playerSelectors";
import { selectCurrentPhase } from "../../../features/match/selectors/stateSelectors";

export default function MatchContainer() {
  const opponents = useAppSelector(selectOpponents || []);
  const { phase } = useAppSelector(selectCurrentPhase);
  const winnerId = useAppSelector((state) => state.game.currentMatch.winnerId);

  const navigate = useNavigate();

  useEffect(() => {
    // If we are in the MatchContainer but have no opponents,
    // the state likely wiped. Send them back to the Map.
    if (opponents.length === 0) {
      console.warn("No opponents found in state. Redirecting to World Map.");
      navigate("/game/world");
    }
  }, [opponents, navigate]);

  return (
    <div className="match">
      <WinnerOverlay />
      <PhaseAlert phase={phase} />
      <Outlet />
      {winnerId && (
        <div className="match-controls--end-game">
          <button type="button">Next Hand</button>
          <button type="button">Quit to Menu</button>
        </div>
      )}
    </div>
  );
}
