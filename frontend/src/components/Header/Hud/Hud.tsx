import { useAppSelector } from "../../../app/hooks/gameHooks";
import {
  selectUsername,
  selectXpStats,
  selectProfileData,
} from "../../../features/profile/profileSelectors";
import "./Hud.css";

export default function Hud() {
  // 1. Use your specialized selectors
  const username = useAppSelector(selectUsername);
  const profile = useAppSelector(selectProfileData);
  const { progressPercentage } = useAppSelector(selectXpStats);

  // 2. Safety check: if no profile is loaded yet, don't crash
  if (!profile) return null;

  return (
    <section className="hud">
      {/* Name on the left */}
      <span
        className="hud__clickable hud__name"
        onClick={() => console.log("Open Menu")}
      >
        {username}
      </span>

      {/* Bar in the middle */}
      <div className="xp-container">
        <meter
          className="hud__xpMeter"
          min="0"
          max="100"
          value={progressPercentage}
        />
        <span className="xp-tooltip">Next</span>
      </div>

      {/* Level on the right */}
      <span
        className="hud__clickable hud__level-num"
        onClick={() => console.log("Open Menu")}
      >
        {profile.level}
      </span>
    </section>
  );
}
