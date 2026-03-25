import { Outlet, useNavigate } from "react-router";
import "./MatchContainer.css";
import { useAppSelector } from "../../../app/hooks";
import { useEffect } from "react";

export default function MatchContainer() {
  const opponents = useAppSelector(
    (state) => state.game.currentMatch.opponents,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (opponents.length === 0) {
      navigate("/game/preGame", { replace: true });
    }
  }, [opponents, navigate]);

  return (
    <div className="match">
      <Outlet />
    </div>
  );
}
