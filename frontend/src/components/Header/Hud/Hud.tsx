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
  const { xpRemaining, progressPercentage } = useAppSelector(selectXpStats);

  // 2. Safety check: if no profile is loaded yet, don't crash
  if (!profile) return null;

  return (
    <section className="hud">
      <div className="hud__name">{username}</div>

      <div className="xp-container">
        <div className="xp-bar-bg">
          <div
            className="xp-bar-fill"
            data-progress={Math.round(progressPercentage)}
          />
        </div>
        <span className="xp-tooltip">
          {xpRemaining} XP to Level {profile.level + 1}
        </span>
      </div>

      <div className="hud__level">{profile.level}</div>
    </section>
  );
}
