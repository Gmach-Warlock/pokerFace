import "./MatchResultsOverlay.css";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/hooks/gameHooks";

import {
  selectWinnerId,
  selectWinningHandLabel,
  selectPlayerById,
} from "../../../../features/match/matchSelectors";
import { useEffect, useState } from "react";
import { prepareNextHand } from "../../../../features/match/matchSlice";
import { useNavigate } from "react-router";

export default function MatchResultOverlay() {
  const dispatch = useAppDispatch();
  const winnerId = useAppSelector(selectWinnerId);
  const handLabel = useAppSelector(selectWinningHandLabel);
  const winner = useAppSelector((state) =>
    selectPlayerById(state, winnerId ?? ""),
  );

  const [displayAmount, setDisplayAmount] = useState(0);
  const navigate = useNavigate();

  // Counter animation logic
  const winAmount = useAppSelector((state) => state.match.lastWinAmount || 0);

  const handleQuit = () => {
    navigate("/game/world");
  };

  const handleNextHand = () => {
    dispatch(prepareNextHand());
  };

  useEffect(() => {
    // Only trigger if we actually have a win amount to show
    if (winAmount > 0) {
      let start = 0;
      const end = winAmount; // Use the stable value here
      const duration = 1000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayAmount(end);
          clearInterval(timer);
        } else {
          setDisplayAmount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [winAmount]); // Only re-run if a new win amount is recorded

  if (!winnerId) return null;

  return (
    <div className="match-overlay">
      <div className="match-overlay__content">
        <h2>{winner?.name} Wins!</h2>
        <p className="hand-type">{handLabel}</p>

        <div className="pot-win">
          <span className="plus">+</span>
          <span className="amount">${displayAmount}</span>
        </div>

        <div className="overlay-actions">
          <button
            type="button"
            className="btn btn--replay"
            onClick={handleNextHand}
          >
            Next Hand
          </button>
          <button
            type="button"
            onClick={handleQuit}
            className="btn btn--secondary"
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
}
