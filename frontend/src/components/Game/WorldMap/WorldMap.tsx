import "./WorldMap.css";
import { worldMapRegistry } from "../../../app/assets/world/worldAssets";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { selectProfileData } from "../../../features/profile/profileSelectors";

export const WorldMap = () => {
  const navigate = useNavigate();

  // Use the selector! TS now knows 'profile' is defined because of the fallback in the selector.
  const profile = useSelector(selectProfileData);
  const garyLevel = profile.level;

  const handleNavigation = (id: string, isLocked: boolean) => {
    if (!isLocked) {
      navigate("/game/lobby", { state: { locationId: id } });
    }
  };
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
                onClick={() => handleNavigation(node.id, isLocked)}
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
