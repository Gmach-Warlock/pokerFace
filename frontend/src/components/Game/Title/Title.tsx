import { useNavigate } from "react-router";
import { useAppDispatch, useSound } from "../../../app/hooks";
import { goToMainMenu } from "../../../features/game/gameSlice";
import "./Title.css";
import { useCallback, useEffect, useState } from "react";
import TitleScreenCards from "./TitleScreenCards/TitleScreenCards";

export default function Title() {
  const [isExiting, setIsExiting] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { playSound } = useSound();

  const navToMainMenu = useCallback(() => {
    if (isExiting) return;

    setIsExiting(true);
    playSound("title", 0.4);

    setTimeout(() => {
      dispatch(goToMainMenu());
      navigate("/game/mainMenu");
    }, 1500);
  }, [dispatch, navigate, isExiting, playSound]);

  useEffect(() => {
    const handleInteraction = (e: Event) => {
      if (e.type === "contextmenu") e.preventDefault();
      navToMainMenu();
    };

    const events = ["keydown", "click" /*, "touchstart", "contextmenu" */];

    events.forEach((type) => window.addEventListener(type, handleInteraction));

    return () => {
      events.forEach((type) =>
        window.removeEventListener(type, handleInteraction),
      );
    };
  }, [navToMainMenu]);

  return (
    /* We pass the pattern to the wrapper so CSS can see it */
    <div className="title-screen-wrapper">
      <div className={`title ${isExiting ? "title--exit" : ""}`}>
        <h1 className="title__title manga-outline neon-glow-cyan">
          Poker Face
        </h1>

        <div
          className={`title__hand-container ${isExiting ? "is-scattering" : ""}`}
        >
          <TitleScreenCards />
        </div>

        <p className="text-shadow">
          {isExiting ? "GOOD LUCK" : "Hit any key to continue"}
        </p>
      </div>
    </div>
  );
}
