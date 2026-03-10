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

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />

        <Route element={<Protected />}>
          <Route path="game" element={<Game />} />
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
