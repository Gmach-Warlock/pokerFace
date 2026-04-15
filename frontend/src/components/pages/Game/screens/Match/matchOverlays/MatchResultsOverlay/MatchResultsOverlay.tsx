import "./MatchResultsOverlay.css";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../app/hooks/gameHooks";
import {
  selectWinnerId,
  selectWinningHandLabel,
} from "../../../../../../../features/match/selectors/stateSelectors";
import { selectHero } from "../../../../../../../features/match/selectors/heroSelectors";
import { selectPlayerById } from "../../../../../../../features/match/selectors/playerSelectors";
import { useEffect, useState } from "react";
import {
  prepareNextHand,
  quitMatch,
} from "../../../../../../../features/match/matchSlice";
import { useNavigate } from "react-router";
import { updateMoney } from "../../../../../../../features/profile/profileSlice";

export default function MatchResultOverlay() {
  const dispatch = useAppDispatch();
  const winnerId = useAppSelector(selectWinnerId);
  const handLabel = useAppSelector(selectWinningHandLabel);
  const winner = useAppSelector((state) =>
    selectPlayerById(state, winnerId ?? ""),
  );
  const hero = useAppSelector(selectHero);
  const [displayAmount, setDisplayAmount] = useState(0);
  const navigate = useNavigate();
  const winAmount = useAppSelector(
    (state) => state.match.results.lastWinAmount || 0,
  );

  const handleQuit = () => {
    if (hero?.profile) {
      dispatch(updateMoney(hero.profile.money));
    }

    dispatch(quitMatch());

    navigate("/game/world");
  };

  const handleNextHand = () => {
    dispatch(prepareNextHand());
  };

  useEffect(() => {
    if (winAmount > 0) {
      let start = 0;
      const end = winAmount;
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
  }, [winAmount]);

  if (!winnerId || !hero || !winner) return null;

  return (
    <div className="match-overlay">
      <div className="match-overlay__content">
        <h2>{winner?.general.name} Wins!</h2>
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
