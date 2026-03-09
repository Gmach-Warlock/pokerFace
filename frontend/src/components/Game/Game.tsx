import Title from "./Title/Title";
import { useAppSelector } from "../../app/hooks";
import type { GameDisplayType } from "../../app/types";
import Match from "./Match/Match";
import PostGame from "./PostGame/PostGame";
import MainMenu from "./MainMenu/MainMenu";
import GameSettings from "./GameSettings/GameSettings";
import PreGame from "./PreGame/PreGame";

export default function Game() {
  const currentlyDisplayed = useAppSelector(
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
      case "mainMenu":
        return <MainMenu />;
      case "settings":
        return <GameSettings />;
      case "preGame":
        return <PreGame />;
    }
  };
  const newGameScreen = createGameScreen(currentlyDisplayed);

  return <div className="game-container">{newGameScreen}</div>;
}
