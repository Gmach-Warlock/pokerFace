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
