import type { BettingButtonProps } from "../../../../../../../app/interfaces/matchInterfaces";

export default function HalfInButton({ onClick }: BettingButtonProps) {
  return (
    <div>
      <button
        type="button"
        title="half in button"
        className="btn btn--half-in"
        onClick={onClick}
      >
        50%
      </button>
    </div>
  );
}
