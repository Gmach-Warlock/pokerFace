import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { useEffect, useCallback, useState } from "react";
import { type SoundEffectType } from "./assets";
import { gameAudio } from "./assets";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export const useSound = () => {
  const playSound = useCallback(
    (effect: SoundEffectType, volume: number = 0.5) => {
      const src = gameAudio[effect];

      if (src) {
        const audio = new Audio(src);
        audio.volume = volume;

        // Play and then remove the element once the sound finishes
        audio.play().catch((e) => console.warn("Audio playback blocked:", e));
        audio.onended = () => audio.remove();
      }
    },
    [],
  );

  return { playSound };
};

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
