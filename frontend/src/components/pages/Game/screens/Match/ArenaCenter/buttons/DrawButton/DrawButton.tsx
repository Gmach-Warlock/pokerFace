import { useAppDispatch } from "../../../../../../../../app/hooks/gameHooks";
import type { BettingButtonPropsInterface } from "../../../../../../../../app/interfaces/matchInterfaces";

import { processArenaAction } from "../../../../../../../../features/match/matchThunks";

export default function DrawButton({
  label,
  isConfirming,
}: BettingButtonPropsInterface) {
  const dispatch = useAppDispatch();
  const handleDraw = () => {
    dispatch(processArenaAction());
  };
  return (
    <div>
      <button
        type="button"
        onClick={handleDraw}
        className={
          isConfirming ? "btn btn-confirm-draw" : "btn btn-draw-standard"
        }
      >
        {label}
      </button>
    </div>
  );
}
