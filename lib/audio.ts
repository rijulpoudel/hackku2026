import { Howl, Howler } from "howler";

// ─── Narrator (ElevenLabs streamed audio) ────────────────────────────────────
let currentNarrator: HTMLAudioElement | null = null;
let currentNarratorUrl: string | null = null;

export function stopNarration() {
  if (currentNarrator) {
    currentNarrator.pause();
    currentNarrator.src = "";
    currentNarrator = null;
  }
  if (currentNarratorUrl) {
    URL.revokeObjectURL(currentNarratorUrl);
    currentNarratorUrl = null;
  }
}

export async function narrateScene(text: string): Promise<void> {
  if (typeof window === "undefined") return;

  // Always stop whatever is currently playing before starting new narration
  stopNarration();

  try {
    const res = await fetch("/api/narrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) return; // Silently skip if ElevenLabs is not configured

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // Store references so we can stop this later
    currentNarratorUrl = url;
    const audio = new Audio(url);
    audio.volume = 0.85;
    currentNarrator = audio;

    audio.play().catch(() => {
      // Browser may block autoplay — ignore silently
    });

    audio.onended = () => {
      URL.revokeObjectURL(url);
      if (currentNarratorUrl === url) {
        currentNarratorUrl = null;
        currentNarrator = null;
      }
    };
  } catch {
    // Silently fail — narration is enhancement, not core gameplay
  }
}

// ─── Background Music ─────────────────────────────────────────────────────────
let bgMusic: Howl | null = null;
let bgMusicScheduled = false;

function _playBgMusic() {
  if (bgMusic) return;
  bgMusic = new Howl({
    src: ["/audio/bg-music.mp3"],
    loop: true,
    volume: 0.18,
    html5: true, // streams without Web Audio API — avoids autoplay block
    onloaderror: () => {
      bgMusic = null;
    },
  });
  bgMusic.play();
}

export function startBgMusic() {
  if (typeof window === "undefined") return;
  if (bgMusic || bgMusicScheduled) return;

  bgMusicScheduled = true;

  // Try immediately (works if there was already a user gesture on this page)
  _playBgMusic();

  // Also hook the next click in case autoplay was blocked — starts music on
  // the very first tap/click the user makes, which always has user-activation.
  const unlock = () => {
    if (!bgMusic) _playBgMusic();
    window.removeEventListener("click", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };
  window.addEventListener("click", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
  window.addEventListener("touchstart", unlock, { once: true });
}

export function stopBgMusic() {
  if (bgMusic) {
    bgMusic.fade(bgMusic.volume() as number, 0, 1500);
    setTimeout(() => {
      bgMusic?.unload();
      bgMusic = null;
    }, 1600);
  }
}

export function setBgMusicVolume(vol: number) {
  bgMusic?.volume(vol);
}

// ─── Sound Effects ────────────────────────────────────────────────────────────
const sfx: Record<string, Howl> = {};

const SFX_FILES: Record<string, string> = {
  click: "/audio/click.mp3",
  "choice-good": "/audio/choice-correct.mp3",
  "choice-neutral": "/audio/choice-neutral.mp3",
  "choice-bad": "/audio/choice-bad.mp3",
};

export function playSfx(key: string) {
  if (typeof window === "undefined") return;

  // Resume Web Audio API context if suspended (production autoplay policy)
  if (Howler.ctx && Howler.ctx.state === "suspended") {
    Howler.ctx.resume();
  }

  if (!sfx[key] && SFX_FILES[key]) {
    sfx[key] = new Howl({
      src: [SFX_FILES[key]],
      volume: key === "click" ? 0.5 : 0.7,
      onloaderror: () => {
        delete sfx[key];
      },
    });
  }
  sfx[key]?.play();
}

export function playChoiceResult(label: string) {
  if (["Best", "Smart"].includes(label)) playSfx("choice-good");
  else if (label === "Neutral") playSfx("choice-neutral");
  else playSfx("choice-bad");
}

// ─── Master volume ────────────────────────────────────────────────────────────
export function setMasterVolume(volume: number) {
  Howler.volume(volume);
}

// ─── Stop everything (use on page exit / home navigation) ────────────────────
export function stopAll() {
  stopNarration();
  Howler.stop();
}
