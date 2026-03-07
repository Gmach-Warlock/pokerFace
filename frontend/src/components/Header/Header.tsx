import { chipLogos } from "../../app/assets";
import "./Header.css";

export default function Header() {
  return (
    <header>
      <div>
        <img
          src={chipLogos.boy}
          alt="poker face logo"
          className="logo-icon-sm"
        />
      </div>
      <div>
        <i className="fa-solid fa-bars"></i>
      </div>
    </header>
  );
}
