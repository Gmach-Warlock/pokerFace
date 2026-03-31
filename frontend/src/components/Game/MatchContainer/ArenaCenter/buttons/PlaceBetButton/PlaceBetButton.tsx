import type { ButtonPropsInterface } from "../../../../../../app/types";

export default function PlaceBetButton({
  label,
  isConfirming,
}: ButtonPropsInterface) {
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
