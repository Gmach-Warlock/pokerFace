import "./Lobby.css";
import { useLobby } from "../../../../../app/hooks/useLobby";
import MatchTransition from "../Match/matchOverlays/MatchTransition/MatchTransition";
import type { DeckStyleType } from "../../../../../app/types/matchTypes";

export default function Lobby() {
  const {
    activeLocale,
    availableDecks,
    previewDeck,
    setPreviewDeck,
    isTransitioning,
    pendingMatchData,
    handleSubmit,
    handleTransitionComplete,
    formattedLocation,
  } = useLobby();

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
        <h2 className="menu-title">{formattedLocation} Lobby</h2>

        <form className="preGame-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Match Variant</label>
            <select
              title="match type dropdown"
              name="matchType"
              defaultValue="draw"
            >
              <option value="draw">Five Card Draw</option>
              <option value="holdem">Texas Hold'em</option>
              <option value="stud">Seven Card Stud</option>
            </select>
          </div>

          <div className="form-group">
            <label>Opponents</label>
            <select
              title="number of opponents dropdown"
              name="number-of-opponents"
              defaultValue="1"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Players
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select
              title="difficulty level dropdown"
              name="difficulty-level"
              defaultValue="normal"
            >
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="form-group">
            <label>Deck Style</label>
            <select
              title="deck style dropdown"
              name="deck-style"
              value={previewDeck}
              onChange={(e) => setPreviewDeck(e.target.value as DeckStyleType)}
            >
              {availableDecks.map((deck) => (
                <option key={deck} value={deck}>
                  {deck}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Decks in Shoe</label>
            <select
              title="number of decks dropdown"
              name="number-of-decks"
              defaultValue="1"
            >
              <option value="1">Single Deck</option>
              <option value="2">Double Deck</option>
              <option value="6">6-Deck Shoe</option>
            </select>
          </div>

          <div className="matchStartButton">
            <button type="submit">PREPARE MATCH</button>
          </div>
        </form>
      </div>
    </div>
  );
}
