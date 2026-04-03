import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import type { BettingInterface } from "../../../../../app/interfaces";
import { selectHerosId } from "../../../../../features/match/matchSelectors";
import { processBet } from "../../../../../features/match/matchSlice";

export default function CallButton({
  currentTableBet = 0,
  currentPlayerBet = 0,
}: BettingInterface) {
  const dispatch = useAppDispatch();
  const herosId = useAppSelector(selectHerosId);

  const amountToCall = Math.max(0, currentTableBet - currentPlayerBet);
  const isCheck = amountToCall === 0;

  const handleCall = () => {
    if (!herosId) return;
    dispatch(
      processBet({
        playerId: herosId,
        amount: amountToCall,
        type: isCheck ? "check" : "call",
      }),
    );
  };

  return (
    <button type="button" className="btn btn--call" onClick={handleCall}>
      {isCheck ? "Check" : `Call $${amountToCall}`}
    </button>
  );
}
