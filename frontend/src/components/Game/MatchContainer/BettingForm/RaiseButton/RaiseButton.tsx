import type { BettingInterface } from "../../../../../app/interfaces/matchInterfaces";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../app/hooks/gameHooks";
import { selectHerosId } from "../../../../../features/match/matchSelectors";
import { processBet } from "../../../../../features/match/matchSlice";

interface RaiseButtonProps extends BettingInterface {
  currentPlayerBet: number;
  sliderValue: number; // The total amount shown on the slider
}

export default function RaiseButton({
  currentPlayerBet = 0,
  sliderValue,
}: RaiseButtonProps) {
  const dispatch = useAppDispatch();
  const herosId = useAppSelector(selectHerosId);

  const handleRaise = () => {
    if (!herosId) return;

    // If I already bet $5 and I want to "Raise to $20",
    // I need to spend $15 more.
    const additionalAmount = sliderValue - currentPlayerBet;
    console.log(herosId, additionalAmount);
    dispatch(
      processBet({
        playerId: herosId,
        amount: additionalAmount,
        type: "raise",
      }),
    );
  };

  return (
    <button type="button" className="btn btn--raise" onClick={handleRaise}>
      Raise to ${sliderValue}
    </button>
  );
}
