import { Outlet, useNavigate } from "react-router";
import "./Match.css";
import { useAppSelector } from "../../../../../app/hooks/gameHooks";
import { useEffect } from "react";
import PhaseAlert from "./matchOverlays/PhaseAlert/PhaseAlert";
import MatchResultOverlay from "./matchOverlays/MatchResultsOverlay/MatchResultsOverlay";
import { selectOpponents } from "../../../../../features/match/selectors/playerSelectors";
import { selectCurrentPhase } from "../../../../../features/match/selectors/stateSelectors";

export default function Match() {
  const opponents = useAppSelector(selectOpponents || []);
  const { phase } = useAppSelector(selectCurrentPhase);
  const winnerId = useAppSelector((state) => state.game.currentMatch.winnerId);

  const navigate = useNavigate();

  useEffect(() => {
    if (opponents.length === 0) {
      console.warn("No opponents found in state. Redirecting to World Map.");
      navigate("/game/world");
    }
  }, [opponents, navigate]);

  return (
    <div className="match">
      <MatchResultOverlay />
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
