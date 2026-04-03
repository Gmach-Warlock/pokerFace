import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import "./App.css";
import Root from "./Root";
import Game from "./components/Game/Game";
import Home from "./components/Home/Home";
import Protected from "./components/Protected/Protected";
import Title from "./components/Game/Title/Title";
import PreGame from "./components/Game/PreGame/PreGame";
import MatchContainer from "./components/Game/MatchContainer/MatchContainer";
import Shelter from "./components/Game/MatchContainer/areas/Shelter/Shelter";
import MainMenu from "./components/Game/MainMenu/MainMenu";
import Halls from "./components/Game/MatchContainer/areas/Halls/Halls";
import { WorldMap } from "./components/Game/WorldMap/WorldMap";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />

        <Route element={<Protected />}>
          <Route path="game" element={<Game />}>
            <Route index element={<Title />} />
            <Route path="title" element={<Title />} />
            <Route path="preGame" element={<PreGame />} />
            <Route path="mainMenu" element={<MainMenu />} />
            <Route path="match" element={<MatchContainer />}>
              <Route path="shelter" element={<Shelter />} />
              <Route path="halls" element={<Halls />} />
            </Route>
            <Route path="world" element={<WorldMap />} />
          </Route>
        </Route>
      </Route>,
    ),
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
