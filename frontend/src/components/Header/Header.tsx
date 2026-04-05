import "./Header.css";
import Hud from "./Hud/Hud";
import Nav from "./Nav/Nav";

export default function Header() {
  return (
    <header className="header">
      <Nav />
      <Hud />
    </header>
  );
}

/* const nextLevelXp = getXpRequiredForLevel(hero.profile.level);
const progressPercent = (hero.profile.xp / nextLevelXp) * 100;

// Render your Styled Progress Bar with width: `${progressPercent}%` */
