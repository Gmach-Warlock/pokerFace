import "./WinnerOverlay.css";
import { useAppSelector } from "../../../../app/hooks";

export default function WinnerOverlay() {
  const { winnerId, winningHand, opponents, herosId } = useAppSelector(
    (state) => state.game.currentMatch,
  );

  if (!winnerId) return null;

  const winnerName =
    winnerId === herosId
      ? "YOU"
      : opponents.find((o) => o.id === winnerId)?.name || "Opponent";

  return (
    <div className="winner-overlay">
      <div className="winner-overlay__content">
        <h2 className="winner-overlay__title">{winnerName} WON!</h2>
        <p className="winner-overlay__hand">{winningHand}</p>
        <div className="winner-overlay__glow"></div>
      </div>
    </div>
  );
}
