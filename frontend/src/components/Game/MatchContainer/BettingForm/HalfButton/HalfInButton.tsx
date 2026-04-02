export default function HalfInButton() {
  const handleHalfIn = () => {};
  return (
    <div>
      <button
        type="button"
        title="half in button"
        className="btn btn--half-in"
        onClick={handleHalfIn}
      >
        50%
      </button>
    </div>
  );
}
