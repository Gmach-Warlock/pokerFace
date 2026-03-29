import { useNavigate } from "react-router";
import { useAppDispatch, useSound } from "../../../app/hooks";
import { goToPreGame, quitPlaying } from "../../../features/game/gameSlice";
import "./MainMenu.css";

export default function MainMenu() {
  const dispatch = useAppDispatch();
  const { playSound } = useSound();
  const navigate = useNavigate();

  const navToPregame = () => {
    dispatch(goToPreGame());
    navigate("/game/preGame");
  };
  const handlePlay = () => {
    playSound("hit1", 0.5);
    navToPregame();
  };

  const handleQuit = () => {
    playSound("hit1", 0.5);
    quitPlaying();
  };

  return (
    <div className="main-menu bg-cyan-500 h-100">
      <button
        type="button"
        className="btn btn--settings btn--menu"
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
                className="btn btn--play btn--menu"
                onClick={handlePlay}
              >
                Play Match
              </button>
            </div>
          </div>
        </form>
        <button
          type="button"
          className="btn btn--quit btn--menu"
          onClick={handleQuit}
        >
          Quit
        </button>
      </div>
    </div>
  );
}
