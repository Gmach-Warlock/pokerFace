import type { BettingButtonProps } from "../../../../../app/interfaces/matchInterfaces";

export default function QuarterInButton({ onClick }: BettingButtonProps) {
  return (
    <div>
      <button
        type="button"
        title="quarter in button"
        className="btn btn--quarter-in"
        onClick={onClick}
      >
        25%
      </button>
    </div>
  );
}
