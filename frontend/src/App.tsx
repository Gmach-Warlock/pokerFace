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
import Match from "./components/Game/Match/Match";

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
            <Route path="match" element={<Match />} />
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
