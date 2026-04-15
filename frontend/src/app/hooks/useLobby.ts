import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAppDispatch, useAppSelector, useSound } from "./gameHooks";
import { startMatch } from "../../features/match/matchSlice";
import {
  selectAvailableDecks,
  selectInitialHeroState,
} from "../../features/match/selectors/heroSelectors";
import type { MatchLocationType } from "../types/worldMapTypes";
import type { PendingMatchData } from "../interfaces/matchInterfaces";
import type {
  DeckStyleType,
  NumberOfOpponentsType,
  DifficultyType,
  MatchType,
  DeckNumberType,
} from "../types/matchTypes";
import { formatLocation } from "../utils/formattingUtils";

export const useLobby = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { playSound } = useSound();

  const availableDecks = useAppSelector(selectAvailableDecks);
  const initialHero = useAppSelector(selectInitialHeroState);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingMatchData, setPendingMatchData] =
    useState<PendingMatchData | null>(null);
  const [previewDeck, setPreviewDeck] = useState<DeckStyleType>(
    (availableDecks?.[0] as DeckStyleType) ?? "arrowBolt",
  );
  const activeLocale =
    (location.state?.locationId as MatchLocationType) ?? "shelter";

  const handleTransitionComplete = () => {
    if (!pendingMatchData) return;

    const { fullData, location: matchLoc } = pendingMatchData;

    dispatch(
      startMatch({
        numberOfOpponents: Number(
          fullData.get("number-of-opponents"),
        ) as NumberOfOpponentsType,
        difficultyLevel:
          (fullData.get("difficulty-level") as DifficultyType) || "normal",
        matchLocation: matchLoc as MatchLocationType,
        matchType: (fullData.get("matchType") as MatchType) || "draw",
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

  return {
    activeLocale,
    availableDecks,
    previewDeck,
    setPreviewDeck,
    isTransitioning,
    pendingMatchData,
    handleSubmit,
    handleTransitionComplete,
    initialHero,
    formattedLocation: formatLocation(activeLocale),
  };
};
