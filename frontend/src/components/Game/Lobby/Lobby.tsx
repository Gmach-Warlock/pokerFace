import { useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useSound,
} from "../../../app/hooks/gameHooks";
import { startMatch } from "../../../features/match/matchSlice";
import {
  selectAvailableDecks,
  selectInitialHeroState,
} from "../../../features/match/matchSelectors";
import "./Lobby.css";
import { useNavigate, useLocation } from "react-router";
import type {
  DeckNumberType,
  DeckStyleType,
  DifficultyType,
  MatchType,
  NumberOfOpponentsType,
} from "../../../app/types/matchTypes";
import type { MatchLocationType } from "../../../app/types/worldMapTypes";
import MatchTransition from "../MatchContainer/overlays/MatchTransition/MatchTransition";

interface PendingMatchData {
  location: string;
  opponents: string;
  fullData: FormData;
}

export default function Lobby() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Access the state passed from WorldMap
  const { playSound } = useSound();

  // 1. Determine the active locale from router state, defaulting to shelter
  const activeLocale =
    (location.state?.locationId as MatchLocationType) ?? "shelter";

  const availableDecks = useAppSelector(selectAvailableDecks);
  const initialHero = useAppSelector(selectInitialHeroState);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingMatchData, setPendingMatchData] =
    useState<PendingMatchData | null>(null);
  const [previewDeck, setPreviewDeck] = useState<string>(
    availableDecks?.[0] ?? "arrowBolt",
  );

  const formatLocation = (text: string) =>
    text
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const handleTransitionComplete = () => {
    if (!pendingMatchData) return;

    const { fullData, location: matchLoc } = pendingMatchData;
    const matchTypeSelected =
      (fullData.get("matchType") as MatchType) || "draw";
    dispatch(
      startMatch({
        // Ensure this is cast correctly to the numeric literal types
        numberOfOpponents: Number(
          fullData.get("number-of-opponents"),
        ) as Exclude<NumberOfOpponentsType, "tbd">,

        // FIX: Change 'levelOfDifficulty' to 'difficultyLevel'
        difficultyLevel:
          (fullData.get("difficulty-level") as DifficultyType) || "normal",

        matchLocation: matchLoc as MatchLocationType,
        matchType: matchTypeSelected,
        numberOfDecks: Number(
          fullData.get("number-of-decks"),
        ) as DeckNumberType,
        deckStyle: fullData.get("deck-style") as DeckStyleType,
        hero: initialHero,
      }),
    );

    navigate(`/game/match/${matchLoc}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setPendingMatchData({
      location: activeLocale,
      opponents: formData.get("number-of-opponents") as string,
      fullData: formData,
    });

    playSound("hit1", 0.5);
    setIsTransitioning(true);
  };

  return (
    <div className={`preGame-container lobby--${activeLocale}`}>
      {isTransitioning && pendingMatchData && (
        <MatchTransition
          location={pendingMatchData.location}
          opponentCount={Number(pendingMatchData.opponents)}
          onComplete={handleTransitionComplete}
        />
      )}

      <div className="preGame-menu">
        <h2 className="menu-title">{formatLocation(activeLocale)} Lobby</h2>

        <form className="preGame-form" onSubmit={handleSubmit}>
          <input type="hidden" name="match-area-select" value={activeLocale} />

          <div className="setting">
            <label>Game Type</label>
            <select name="matchType" title="match type">
              <option value="draw">5-Card Draw</option>
              <option value="holdem">Texas Hold'em</option>
              <option value="stud">7-Card Stud</option>
            </select>
          </div>

          {/* --- Opponents --- */}
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

          {/* --- Difficulty --- */}
          <div className="setting">
            <label htmlFor="difficulty-level">Difficulty</label>
            <select name="difficulty-level" id="difficulty-level">
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* --- Deck Style with Reactive Preview --- */}
          <div className="setting setting--style">
            <div className="label-with-preview">
              <label>Deck Style</label>
              <img
                src={`/${previewDeck}.png`}
                alt="Preview"
                className="deck-preview-image"
                onError={(e) => {
                  e.currentTarget.src = "/arrowBolt.png";
                }}
              />
            </div>
            <select
              name="deck-style"
              value={previewDeck}
              onChange={(e) => setPreviewDeck(e.target.value)}
              title="deck style"
            >
              {availableDecks.map((deck) => (
                <option key={deck} value={deck}>
                  {deck}
                </option>
              ))}
            </select>
          </div>
          <div className="setting">
            <label>Number of Decks</label>
            <select
              name="number-of-decks"
              title="number of decks"
              defaultValue="1"
            >
              <option value="1">1 Deck</option>
              <option value="2">2 Decks</option>
            </select>
          </div>

          <div className="setting">
            <label>Current Locale</label>
            <div className="location-display-box">
              <span className="location-name">
                {formatLocation(activeLocale)}
              </span>
            </div>
          </div>

          <div className="matchStartButton">
            <button type="submit">PREPARE MATCH</button>
          </div>
        </form>
      </div>
    </div>
  );
}
