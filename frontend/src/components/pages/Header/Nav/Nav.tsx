import LoginButton from "./LoginButton/LoginButton";
import LogoutButton from "./LogoutButton/LogoutButton";
import { useAppSelector } from "../../../../app/hooks/gameHooks";
import "./Nav.css";

export default function Nav() {
  const authorized = useAppSelector((state) => state.profile.meta.authorized);

  return (
    <div className="nav">
      <div className="nav__item"></div>
      <div className="nav__item">
        {authorized ? <LogoutButton /> : <LoginButton />}
      </div>
      <div className="nav__item">
        <i className="fa-solid fa-bars"></i>
      </div>
    </div>
  );
}
