import { useNavigate } from "react-router";
import { royalFlush } from "../../../app/assets";
import { useAppDispatch } from "../../../app/hooks";
import { goToMainMenu } from "../../../features/game/gameSlice";
import Hand from "../../Hand/Hand";
import "./Title.css";
import { useCallback, useEffect, useState } from "react";

export default function Title() {
  const [isExiting, setIsExiting] = useState(false);
  const winningHand = royalFlush;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const hitAudio = "/pokerFaceTitleHit.wav";

  const navToMainMenu = useCallback(() => {
    if (isExiting) return;

    setIsExiting(true);
    const titleHit = new Audio(hitAudio);
    titleHit.play().catch((e) => console.log(e));

    setTimeout(() => {
      dispatch(goToMainMenu());
      navigate("/game/mainMenu");
    }, 1500);
  }, [dispatch, navigate, isExiting]);

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
    <div className={`title ${isExiting ? "title--exit" : ""}`}>
      <h1 className="title__title manga-outline neon-glow-cyan">Poker Face</h1>

      <div className="title__hand-container">
        <Hand
          matchType="draw"
          cards={winningHand}
          currentLocation="demo"
          hand="tbd"
        />
      </div>

      <p className="text-shadow">
        {isExiting ? "GOOD LUCK" : "Hit any key to continue"}
      </p>
    </div>
  );
}
