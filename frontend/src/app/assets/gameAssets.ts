export const gameAudio = {
  hits: {
    title: "/pokerFaceTitleHit.wav",
    hit1: "/pokerFaceHit1.wav",
    hit2: "/pokerFaceHit2.wav",
    sprinkles: "/pokerFaceSprinkles.wav",
  },
  tracks: {
    shelter: "/theShelter.wav",
  },
} as const;

export type SoundEffectType =
  | keyof typeof gameAudio.hits
  | keyof typeof gameAudio.tracks;
