import { useNavigate } from "react-router";
import { useAppDispatch } from "../../../app/hooks";
import { goToPreGame } from "../../../features/game/gameSlice";
import "./MainMenu.css";

export default function MainMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const navToPregame = () => {
    dispatch(goToPreGame());
    navigate("/game/preGame");
  };
  const handleClick = () => {
    navToPregame();
  };

  return (
    <div className="main-menu bg-cyan-500 h-100">
      <button
        type="button"
        className="btn btn--settings"
        title="previous button"
      >
        <i className="fa-solid fa-gear"></i>
      </button>
      <h2>Main Menu</h2>
      <div className="main-menu-options-container">
        <div className="main-menu__back"></div>
        <form action="/">
          <div className="general">
            <div className="setting">
              <label htmlFor="theme-setting"></label>
              <button
                type="button"
                className="btn btn--play"
                onClick={handleClick}
              >
                Play Match
              </button>
            </div>
          </div>
        </form>
        <button type="button" className="btn btn--quit">
          Quit
        </button>
      </div>
    </div>
  );
}
