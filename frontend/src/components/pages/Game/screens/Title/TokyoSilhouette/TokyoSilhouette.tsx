import "./TokyoSilhouette.css";

const Windows = ({
  count,
  activeIndices = [],
}: {
  count: number;
  activeIndices?: number[];
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const id = i + 1;
        const isActive = activeIndices.includes(id);

        return (
          <div
            key={id}
            className={`window w-${id} ${isActive ? "window--active" : "window--off"}`}
          ></div>
        );
      })}
    </>
  );
};

export default function TokyoSilhouette() {
  return (
    <div className="skyline-grid">
      {/* Tall Hero Building - lots of lights */}
      <div className="building b-1">
        {/* Count must be at least 10 to see 10 windows */}
        <Windows count={80} activeIndices={[1, 3, 5, 8, 10, 12, 14, 16]} />
      </div>

      {/* Background Building - fewer, static lights */}
      <div className="building building--bg b-bg-1">
        <Windows count={10} activeIndices={[2, 5]} />
      </div>

      <div className="building b-2"></div>
      <div className="building b-3"></div>
      <div className="building b-4"></div>
      <div className="building b-5"></div>
      <div className="building b-6"></div>

      {/* Background Layer */}
      <div className="building building--bg b-bg-1"></div>
      <div className="building building--bg b-bg-2"></div>
      <div className="building building--bg b-bg-3"></div>
    </div>
  );
}
