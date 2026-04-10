import type { BettingInterface } from "../../../../../app/interfaces/matchInterfaces";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../app/hooks/gameHooks";
import { selectHerosId } from "../../../../../features/match/matchSelectors";
import { handleBet } from "../../../../../features/match/matchSlice";

interface RaiseButtonProps extends BettingInterface {
  currentPlayerBet: number;
  sliderValue: number; // The total amount Gary wants to have on the table
}

export default function RaiseButton({
  currentPlayerBet = 0,
  sliderValue,
}: RaiseButtonProps) {
  const dispatch = useAppDispatch();
  const herosId = useAppSelector(selectHerosId);

  const handleRaise = () => {
    if (!herosId) return;

    /**
     * Logic Check:
     * In our new 'resolveBetState' utility, 'amount' represents
     * the NEW chips being put into the pot.
     * * If Gary has $5 in and wants to Raise TO $20,
     * we send $15 to the reducer.
     */
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
