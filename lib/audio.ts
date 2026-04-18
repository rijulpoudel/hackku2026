import { Howl, Howler } from "howler";

const sounds: Record<string, Howl> = {};

const SOUND_FILES: Record<string, string> = {
  "narrator-year1": "/audio/narrator-year1.mp3",
  "narrator-year2": "/audio/narrator-year2.mp3",
  "narrator-year3": "/audio/narrator-year3.mp3",
  "narrator-transition": "/audio/narrator-transition.mp3",
  "choice-correct": "/audio/choice-correct.mp3",
  "choice-neutral": "/audio/choice-neutral.mp3",
  "choice-bad": "/audio/choice-bad.mp3",
};

export function playAudio(key: string) {
  if (typeof window === "undefined") return;
  if (!sounds[key] && SOUND_FILES[key]) {
    sounds[key] = new Howl({ src: [SOUND_FILES[key]], volume: 0.7 });
  }
  sounds[key]?.play();
}

export function setMasterVolume(volume: number) {
  Howler.volume(volume);
}
