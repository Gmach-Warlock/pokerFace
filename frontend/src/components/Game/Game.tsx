import { Outlet } from "react-router";
import Title from "./Title/Title";
import { UseAppSelector } from "../../app/hooks";
import type { GameDisplayType } from "../../app/types";
import Match from "./Match/Match";
import PostGame from "./PostGame/PostGame";
import MainMenu from "./MainMenu/MainMenu";
import GameSettings from "./GameSettings/GameSettings";

export default function Game() {
  const currentlyDisplayed = UseAppSelector(
    (state) => state.game.currentlyDisplayed,
  );

  const createGameScreen = (currentlyDisplayed: GameDisplayType) => {
    switch (currentlyDisplayed) {
      case "title":
        return <Title />;
      case "match":
        return <Match />;
      case "postGame":
        return <PostGame />;
      case "mainmenu":
        return <MainMenu />;
      case "settings":
        return <GameSettings />;
    }
  };
  const newGameScreen = createGameScreen(currentlyDisplayed);

  return (
    <div className="game-container">
      <Outlet />
      {newGameScreen}
    </div>
  );
}
