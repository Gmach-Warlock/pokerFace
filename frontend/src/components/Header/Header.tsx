import { useAppSelector } from "../../app/hooks";
import "./Header.css";
import LoginButton from "./LoginButton/LoginButton";
import LogoutButton from "./LogoutButton/LogoutButton";

export default function Header() {
  const authorized = useAppSelector((state) => state.authorize.authorized);

  return (
    <header>
      <div className="place-center items-center"></div>
      <div className="place-center items-center">
        {authorized ? <LogoutButton /> : <LoginButton />}
      </div>
      <div className="place-center items-center">
        <i className="fa-solid fa-bars"></i>
      </div>
    </header>
  );
}
