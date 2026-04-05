import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../app/hooks/gameHooks";
import type { BettingButtonPropsInterface } from "../../../../../../app/interfaces/matchInterfaces";
import { selectMatchLocation } from "../../../../../../features/match/matchSelectors";
import { processArenaAction } from "../../../../../../features/match/matchThunks";
import { performAnteUp } from "../../../../../../features/match/matchSlice";

export default function DealButton({
  label,
  isConfirming,
}: BettingButtonPropsInterface) {
  const location = useAppSelector(selectMatchLocation);
  const dispatch = useAppDispatch();
  const handleDeal = () => {
    dispatch(performAnteUp({ location: location }));

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
