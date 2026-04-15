import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import "./App.css";
import Root from "./Root";
import Game from "./components/pages/Game/Game";
import Home from "./components/pages/Home/Home";
import Protected from "./components/Protected/Protected";
import Title from "./components/pages/Game/screens/Title/Title";
import MatchContainer from "./components/pages/Game/screens/Match/Match";
import Shelter from "./components/pages/Game/screens/Match/areas/Shelter/Shelter";
import MainMenu from "./components/pages/Game/screens/MainMenu/MainMenu";
import Halls from "./components/pages/Game/screens/Match/areas/Halls/Halls";
import { WorldMap } from "./components/pages/Game/screens/WorldMap/WorldMap";
import Lobby from "./components/pages/Game/screens/Lobby/Lobby";

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
            <Route path="lobby" element={<Lobby />} />
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
