import { PlayerState, CharacterType } from "@/types/game";

const SAVE_KEY = "launch_saves";
const MAX_SLOTS = 5;

const CHARACTER_EMOJI: Record<CharacterType, string> = {
  maya: "🔬",
  alex: "💼",
  jordan: "🎨",
  sam: "📚",
  custom: "✨",
};

const CHARACTER_TITLE: Record<CharacterType, string> = {
  maya: "PhD Student",
  alex: "Corporate Tech",
  jordan: "Freelance Creative",
  sam: "Public Teacher",
  custom: "Custom Character",
};

export interface SaveSlot {
  id: string;
  savedAt: number;
  characterName: string;
  character: CharacterType;
  characterEmoji: string;
  characterTitle: string;
  year: number;
  age: number;
  netWorth: number;
  playerState: PlayerState;
}

function readSlots(): SaveSlot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as SaveSlot[]) : [];
  } catch {
    return [];
  }
}

function writeSlots(slots: SaveSlot[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
}

export function listSaves(): SaveSlot[] {
  return readSlots().sort((a, b) => b.savedAt - a.savedAt);
}

export function saveGame(playerState: PlayerState): SaveSlot {
  const slots = readSlots();
  const slot: SaveSlot = {
    id: `save_${Date.now()}`,
    savedAt: Date.now(),
    characterName: playerState.name,
    character: playerState.character,
    characterEmoji: CHARACTER_EMOJI[playerState.character] ?? "🎓",
    characterTitle: CHARACTER_TITLE[playerState.character] ?? "Graduate",
    year: playerState.currentYear,
    age: playerState.age,
    netWorth: playerState.netWorth,
    playerState,
  };

  // Remove oldest slots if we're over the limit
  const updated = [slot, ...slots].slice(0, MAX_SLOTS);
  writeSlots(updated);
  return slot;
}

export function loadSave(id: string): PlayerState | null {
  const slot = readSlots().find((s) => s.id === id);
  return slot?.playerState ?? null;
}

export function deleteSave(id: string) {
  writeSlots(readSlots().filter((s) => s.id !== id));
}

export function hasSaves(): boolean {
  return readSlots().length > 0;
}

export function formatSaveDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
