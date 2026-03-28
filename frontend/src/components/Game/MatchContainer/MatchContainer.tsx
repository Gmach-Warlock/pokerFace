import { Outlet, useNavigate } from "react-router";
import "./MatchContainer.css";
import { useAppSelector } from "../../../app/hooks";
import { useEffect } from "react";
import PhaseAlert from "./PhaseAlert/PhaseAlert";
import WinnerOverlay from "./WinnerOverlay/WinnerOverlay";

export default function MatchContainer() {
  const opponents = useAppSelector(
    (state) => state.game.currentMatch.opponents,
  );
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
