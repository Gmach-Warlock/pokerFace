import "./Chip.css";

export default function Chip() {
  return (
    <div className="chip-container">
      <div className="chip-outer-border place-center">
        <div className="chip-other-layer-container place-center">
          <div className="chip-outer-cap-border">
            <div className="chip-inner-stripes">
              <div className="chip-inner-cap"></div>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}
