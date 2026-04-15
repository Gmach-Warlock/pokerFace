import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../../../../../../app/hooks/gameHooks";

import { selectHero } from "../../../../../../../features/match/selectors/heroSelectors";

export function MatchGuard({ children }: { children: React.ReactNode }) {
  const hero = useAppSelector(selectHero);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hero) {
      console.warn("Hero data missing. Redirecting to lobby...");
      navigate("/game/world", { replace: true });
    }
  }, [hero, navigate]);

  if (!hero) return null;

  return <>{children}</>;
}
