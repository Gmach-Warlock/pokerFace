import "./WinnerOverlay.css";
import { useAppSelector } from "../../../../app/hooks";
import {
  selectWinnerId,
  selectWinnerName,
  selectWinningHandLabel,
} from "../../../../features/game/gameSelectors";

export default function WinnerOverlay() {
  // Only subscribe to the specific winner data
  const winnerId = useAppSelector(selectWinnerId);
  const winnerName = useAppSelector(selectWinnerName);
  const winningHand = useAppSelector(selectWinningHandLabel);

  if (!winnerId) return null;

  return (
    <div className="winner-overlay">
      <div className="winner-overlay__content">
        <h2 className="winner-overlay__title">{winnerName} WON!</h2>
        <p className="winner-overlay__hand">{winningHand}</p>
        <div className="winner-overlay__glow" />
      </div>
    </div>
  );
}
