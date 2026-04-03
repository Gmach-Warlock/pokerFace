import type { BettingButtonProps } from "../../../../../app/interfaces/matchInterfaces";

export default function ThreeQuartersInButton({ onClick }: BettingButtonProps) {
  const handleThreeQuartersIn = () => {
    onClick();
  };
  return (
    <div>
      <button
        type="button"
        title="three quarters in button"
        className="btn btn--three-quarters"
        onClick={handleThreeQuartersIn}
      >
        75%
      </button>
    </div>
  );
}
