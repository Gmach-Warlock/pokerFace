import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { startMatch } from "../../../features/game/gameSlice";
import {
  selectAvailableDecks,
  selectAvailableLocations,
  selectInitialHeroState,
} from "../../../features/game/gameSelectors";
import "./PreGame.css";
import { useNavigate } from "react-router";
import type {
  DeckNumberType,
  DeckStyleType,
  DifficultyType,
  MatchLocationType,
  MatchType,
  NumberOfOpponentsType,
} from "../../../app/types";

export default function PreGame() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Atomic Selectors
  const availableDecks = useAppSelector(selectAvailableDecks);
  const locations = useAppSelector(selectAvailableLocations);
  const initialHero = useAppSelector(selectInitialHeroState);

  const formatLocation = (text: string) =>
    text
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const numDecks = Number(formData.get("number-of-decks"));
    const matchType = formData.get("matchType") as MatchType;

    dispatch(
      startMatch({
        numberOfOpponents: Number(
          formData.get("number-of-opponents"),
        ) as NumberOfOpponentsType,
        levelOfDifficulty: formData.get("difficulty-level") as DifficultyType,
        matchLocation: formData.get("match-area-select") as MatchLocationType,
        matchType: matchType,
        numberOfDecks: numDecks as DeckNumberType,
        deckStyle: formData.get("deck-style") as DeckStyleType,

        hero: initialHero, // Data comes ready-to-go from selector
      }),
    );

    navigate(`/game/match/${formData.get("match-area-select")}`);
  };

  return (
    <div className="preGame-container">
      <div className="preGame-menu">
        <h2 className="menu-title">Match Info</h2>
        <form className="preGame-form" onSubmit={handleSubmit}>
          <div className="setting">
            <label>Game Type</label>
            <select name="matchType" title="select game type">
              <option value="draw">5-Card Draw</option>
              <option value="holdem">Texas Hold'em</option>
              <option value="stud">7-Card Stud</option>
            </select>
          </div>

          <div className="setting">
            <label>Opponents</label>
            <select name="number-of-opponents" title="number of opponents">
              {[2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="setting">
            <label>Decks</label>
            <select name="number-of-decks" title="number of decks">
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="setting">
            <label>Deck Style</label>
            <select name="deck-style" title="deck style name">
              {availableDecks.map((deck) => (
                <option key={deck} value={deck}>
                  {deck}
                </option>
              ))}
            </select>
          </div>

          <div className="setting">
            <label>Location</label>
            <select name="match-area-select" title="match area select">
              {locations.map((area) => (
                <option key={area} value={area}>
                  {`The ${formatLocation(area)}`}
                </option>
              ))}
            </select>
          </div>

          {/* ... other settings ... */}

          <div className="matchStartButton">
            <button type="submit">Start Match</button>
          </div>
        </form>
      </div>
    </div>
  );
}
