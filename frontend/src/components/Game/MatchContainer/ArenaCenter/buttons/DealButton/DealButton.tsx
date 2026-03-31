import { useAppDispatch } from "../../../../../../app/hooks";
import { type ButtonPropsInterface } from "../../../../../../app/types";
import { processArenaAction } from "../../../../../../features/match/matchThunks";

export default function DealButton({
  label,
  isConfirming,
}: ButtonPropsInterface) {
  const dispatch = useAppDispatch();
  const handleDeal = () => {
    dispatch(processArenaAction());
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDeal}
        className={isConfirming ? "btn-confirm-draw" : "btn-draw-standard"}
      >
        {label}
      </button>
    </div>
  );
}
