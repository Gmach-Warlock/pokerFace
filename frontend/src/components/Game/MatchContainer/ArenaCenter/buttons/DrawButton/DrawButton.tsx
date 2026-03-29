import { type ButtonPropsInterface } from "../../../../../../app/types";

export default function DrawButton({
  onClick,
  label,
  isConfirming,
}: ButtonPropsInterface) {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        className={isConfirming ? "btn-confirm-draw" : "btn-draw-standard"}
      >
        {label}
      </button>
    </div>
  );
}
