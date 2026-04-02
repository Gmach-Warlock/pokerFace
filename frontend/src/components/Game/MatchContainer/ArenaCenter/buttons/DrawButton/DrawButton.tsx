import { useAppDispatch } from "../../../../../../app/hooks";
import { type ButtonPropsInterface } from "../../../../../../app/types";

import { processArenaAction } from "../../../../../../features/match/matchThunks";

export default function DrawButton({
  label,
  isConfirming,
}: ButtonPropsInterface) {
  const dispatch = useAppDispatch();
  const handleDraw = () => {
    dispatch(processArenaAction());
  };
  return (
    <div>
      <button
        type="button"
        onClick={handleDraw}
        className={isConfirming ? "btn-confirm-draw" : "btn-draw-standard"}
      >
        {label}
      </button>
    </div>
  );
}
