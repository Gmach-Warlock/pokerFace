import type { BettingButtonProps } from "../../../../../app/interfaces/matchInterfaces";

export default function MatchPotButton({ onClick }: BettingButtonProps) {
  return (
    <div>
      <button
        type="button"
        title="match pot button"
        className="btn btn--match-pot"
        onClick={onClick}
      >
        Pot
      </button>
    </div>
  );
}
