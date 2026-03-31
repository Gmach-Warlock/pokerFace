import { useState } from "react";
import { useAppDispatch, useAppSelector, useSound } from "../../../app/hooks";
import { startMatch } from "../../../features/match/matchSlice";
import {
  selectAvailableDecks,
  selectAvailableLocations,
  selectInitialHeroState,
} from "../../../features/match/matchSelectors";
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
import MatchTransition from "../MatchContainer/overlays/MatchTransition/MatchTransition";

interface PendingMatchData {
  location: string;
  opponents: string;
  fullData: FormData;
}

export default function PreGame() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { playSound } = useSound();

  // Selectors
  const availableDecks = useAppSelector(selectAvailableDecks);
  const locations = useAppSelector(selectAvailableLocations);
  const initialHero = useAppSelector(selectInitialHeroState);

  // State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingMatchData, setPendingMatchData] =
    useState<PendingMatchData | null>(null);
  const [previewDeck, setPreviewDeck] = useState<string>(
    availableDecks[0] || "arrowBolt",
  );

  const formatLocation = (text: string) =>
    text
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // 1. This function runs AFTER the Punch-Out animation finishes
  const handleTransitionComplete = () => {
    if (!pendingMatchData) return;

    const { fullData } = pendingMatchData;
    const numDecks = Number(fullData.get("number-of-decks"));
    const matchType = fullData.get("matchType") as MatchType;

    dispatch(
      startMatch({
        numberOfOpponents: Number(
          fullData.get("number-of-opponents"),
        ) as NumberOfOpponentsType,
        levelOfDifficulty:
          (fullData.get("difficulty-level") as DifficultyType) || "normal",
        matchLocation: fullData.get("match-area-select") as MatchLocationType,
        matchType: matchType,
        numberOfDecks: numDecks as DeckNumberType,
        deckStyle: fullData.get("deck-style") as DeckStyleType,
        hero: initialHero,
      }),
    );

    navigate(`/game/match/${fullData.get("match-area-select")}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // 2. Set the data for the transition overlay and trigger it
    setPendingMatchData({
      location: formData.get("match-area-select") as string,
      opponents: formData.get("number-of-opponents") as string,
      fullData: formData,
    });

    playSound("hit1", 0.5);
    setIsTransitioning(true);
  };

  return (
    <div className="preGame-container">
      {/* 3. Guard added: Only render if transitioning AND we have data */}
      {isTransitioning && pendingMatchData && (
        <MatchTransition
          location={pendingMatchData.location}
          opponentCount={Number(pendingMatchData.opponents)}
          onComplete={handleTransitionComplete}
        />
      )}

      <div className="preGame-menu">
        <h2 className="menu-title">Match Info</h2>
        <form className="preGame-form" onSubmit={handleSubmit}>
          {/* ... Game Type and Opponents selects stay the same ... */}
          <div className="setting">
            <label>Game Type</label>
            <select name="matchType" title="select game type">
              <option value="draw">5-Card Draw</option>
              <option value="holdem">Texas Hold'em</option>
              <option value="stud">7-Card Stud</option>
            </select>
          </div>

          <div className="setting">
            <label htmlFor="difficulty-level">Level of Difficulty</label>
            <select name="difficulty-level" id="difficulty-level">
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
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
              title="deck style name"
              value={previewDeck}
              onChange={(e) => setPreviewDeck(e.target.value)}
            >
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

          <div className="matchStartButton">
            <button type="submit">Start Match</button>
          </div>
        </form>
      </div>
    </div>
  );
}
