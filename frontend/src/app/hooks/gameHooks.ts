import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { useEffect, useCallback, useState } from "react";
import type { SoundEffectType } from "../assets/game/gameAssets";
import { gameAudio } from "../assets/game/gameAssets";
import { Howl } from "howler";

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
    (
      effect: SoundEffectType | string,
      volume: number = 0.5,
      loop: boolean = false,
    ) => {
      // Create a flat map of all sound categories
      const allSounds: Record<string, string> = {
        ...gameAudio.hits,
        ...gameAudio.tracks,
      };

      const src = allSounds[effect];

      if (src) {
        const sound = new Howl({
          src: [src],
          volume: volume,
          loop: loop,
          html5: true,
        });

        sound.play();
        return sound;
      }
      return null;
    },
    [],
  );

  return { playSound };
};

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
