import type { BettingInterface } from "../../../../../../../app/interfaces/matchInterfaces";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../app/hooks/gameHooks";
import { selectHerosId } from "../../../../../../../features/match/selectors/heroSelectors";
import { handleBet } from "../../../../../../../features/match/matchSlice";

interface RaiseButtonProps extends BettingInterface {
  currentPlayerBet: number;
  sliderValue: number;
}

export default function RaiseButton({
  currentPlayerBet = 0,
  sliderValue,
}: RaiseButtonProps) {
  const dispatch = useAppDispatch();
  const herosId = useAppSelector(selectHerosId);

  const handleRaise = () => {
    if (!herosId) return;

    const additionalAmount = sliderValue - currentPlayerBet;

    dispatch(
      handleBet({
        playerId: herosId,
        amount: additionalAmount,
        type: "raise",
      }),
    );
  };

  return (
    <button
      type="button"
      className="btn btn--raise"
      onClick={handleRaise}
      disabled={sliderValue <= currentPlayerBet} // Defensive check
    >
      Raise to ${sliderValue}
    </button>
  );
}
