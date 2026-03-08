import { chipLogos } from "../../app/assets";
import "./Header.css";

export default function Header() {
  return (
    <header>
      <div className="place-center items-center">
        <img
          src={chipLogos.boy}
          alt="poker face logo"
          className="logo-icon-sm place-center fit-content"
        />
      </div>
      <div className="place-center items-center">
        <i className="fa-solid fa-bars"></i>
      </div>
    </header>
  );
}
