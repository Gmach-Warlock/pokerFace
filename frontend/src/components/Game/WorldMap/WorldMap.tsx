import "./WorldMap.css";
import { worldMapRegistry } from "../../../app/assets/worldMapAssets";

export const WorldMap = () => {
  const garyLevel = 1;

  return (
    <div className="world-map-wrapper">
      <div className="map-canvas">
        {Object.values(worldMapRegistry)
          // 1. Filter out undefined/null nodes to satisfy TypeScript
          .filter((node): node is NonNullable<typeof node> => !!node)
          .map((node) => {
            const isLocked = garyLevel < node.requirements.minLevel;

            // 2. Sanitize name: "The Shelter" -> "the-shelter"
            const locationClass = node.displayName
              .toLowerCase()
              .replace(/\s+/g, "-");

            return (
              <div
                key={node.id}
                className={`map-node ${isLocked ? "locked" : "active"} map__${locationClass}`}
              >
                <div className="node-pulse" />
                <div className="node-icon">{isLocked ? "🔒" : "♦"}</div>
                <span className="node-label">{node.displayName}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
};
