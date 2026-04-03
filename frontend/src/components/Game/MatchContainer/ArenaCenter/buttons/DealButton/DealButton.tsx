import { useAppDispatch } from "../../../../../../app/hooks/gameHooks";
import type { BettingButtonPropsInterface } from "../../../../../../app/interfaces/matchInterfaces";
import { processArenaAction } from "../../../../../../features/match/matchThunks";

export default function DealButton({
  label,
  isConfirming,
}: BettingButtonPropsInterface) {
  const dispatch = useAppDispatch();
  const handleDeal = () => {
    dispatch(processArenaAction());
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDeal}
        className={isConfirming ? "btn-confirm-draw" : "btn btn-draw-standard"}
      >
        {label}
      </button>
    </div>
  );
}
