import "./MatchResultsOverlay.css";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectWinnerId,
  selectWinningHandLabel,
  selectPot,
  selectPlayerById,
} from "../../../../features/game/gameSelectors";
import { useEffect, useState } from "react";
import {
  prepareNextHand,
  quitPlaying,
} from "../../../../features/game/gameSlice";

export default function MatchResultOverlay() {
  const dispatch = useAppDispatch();
  const winnerId = useAppSelector(selectWinnerId);
  const handLabel = useAppSelector(selectWinningHandLabel);
  const potAmount = useAppSelector(selectPot);
  const winner = useAppSelector((state) =>
    selectPlayerById(state, winnerId ?? ""),
  );

  const [displayAmount, setDisplayAmount] = useState(0);

  // Counter animation logic
  useEffect(() => {
    if (potAmount > 0) {
      let start = 0;
      const end = potAmount;
      const duration = 1000; // 1 second animation
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
  }, [potAmount]);

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
