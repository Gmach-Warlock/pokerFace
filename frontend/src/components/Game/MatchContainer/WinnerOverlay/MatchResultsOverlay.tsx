import "./MatchResultsOverlay.css";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";

import {
  selectWinnerId,
  selectWinningHandLabel,
  selectPlayerById,
} from "../../../../features/match/matchSelectors";
import { useEffect, useState } from "react";
import { quitPlaying } from "../../../../features/game/gameSlice";
import { prepareNextHand } from "../../../../features/match/matchSlice";

export default function MatchResultOverlay() {
  const dispatch = useAppDispatch();
  const winnerId = useAppSelector(selectWinnerId);
  const handLabel = useAppSelector(selectWinningHandLabel);
  const winner = useAppSelector((state) =>
    selectPlayerById(state, winnerId ?? ""),
  );

  const [displayAmount, setDisplayAmount] = useState(0);

  // Counter animation logic
  const winAmount = useAppSelector(
    (state) => state.game.currentMatch.lastWinAmount || 0,
  );

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
          <button onClick={() => dispatch(prepareNextHand())}>Next Hand</button>
          <button
            onClick={() => dispatch(quitPlaying())}
            className="btn-secondary"
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
}
