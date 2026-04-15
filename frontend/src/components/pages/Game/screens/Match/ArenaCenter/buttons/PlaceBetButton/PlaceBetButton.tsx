import type { BettingButtonPropsInterface } from "../../../../../../../../app/interfaces/matchInterfaces";

export default function PlaceBetButton({
  label,
  isConfirming,
}: BettingButtonPropsInterface) {
  const handlePlaceBet = () => {};

  return (
    <div>
      <button
        type="button"
        onClick={handlePlaceBet}
        className={isConfirming ? "btn-confirm-draw" : "btn-draw-standard"}
      >
        {label}
      </button>
    </div>
  );
}
