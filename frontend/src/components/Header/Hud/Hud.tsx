import { useAppSelector } from "../../../app/hooks";
import "./Hud.css";

export default function Hud() {
  const username = useAppSelector((state) => state.profile.meta.username);
  const playerData = useAppSelector((state) => state.profile.playerData);

  return (
    <section className="hud">
      <div className="hud__name">{username}</div>
      <div className="hud__level">{playerData.level}</div>
      <div className="hud__wins">{`W: ${playerData.wins}`}</div>
      <div className="hud__losses">{`L: ${playerData.losses}`}</div>
    </section>
  );
}
