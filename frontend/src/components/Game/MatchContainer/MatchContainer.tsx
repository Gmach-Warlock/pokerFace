import { Outlet, useNavigate } from "react-router";
import "./MatchContainer.css";
import { useAppSelector } from "../../../app/hooks/gameHooks";
import { useEffect } from "react";
import PhaseAlert from "./PhaseAlert/PhaseAlert";
import WinnerOverlay from "./WinnerOverlay/MatchResultsOverlay";
import { selectOpponents } from "../../../features/match/matchSelectors";

export default function MatchContainer() {
  const opponents = useAppSelector(selectOpponents || []);
  const phase = useAppSelector(
    (state) => state.game.currentMatch.currentPhase.phase,
  );
  const winnerId = useAppSelector((state) => state.game.currentMatch.winnerId);

  const navigate = useNavigate();

  useEffect(() => {
    if (opponents.length === 0) {
      navigate("/game/preGame", { replace: true });
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
