import type { BettingButtonProps } from "../../../../../app/interfaces/matchInterfaces";

export default function AllInButton({ onClick }: BettingButtonProps) {
  return (
    <div>
      <button
        type="button"
        title="all in button"
        className="btn btn--all-in"
        onClick={onClick}
      >
        All In
      </button>
    </div>
  );
}
