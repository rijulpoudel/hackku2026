import { NextRequest, NextResponse } from "next/server";
import { generateNextDecision } from "@/lib/gemini";
import { getCharacterDecision } from "@/lib/character-decisions";
import { FALLBACK_DECISIONS } from "@/lib/fallback-decisions";
import { PlayerState } from "@/types/game";

export async function POST(req: NextRequest) {
  const playerState: PlayerState = await req.json();

  // Custom character: skip hard-coded decisions, always use Gemini for personalization
  if (playerState.character !== 'custom') {
    const characterDecision = getCharacterDecision(
      playerState.character,
      playerState.currentYear,
    );
    if (characterDecision) return NextResponse.json(characterDecision);
  }

  // Fallback: try Gemini (if somehow we go beyond year 12)
  let attempts = 0;
  while (attempts < 2) {
    try {
      const decision = await generateNextDecision(playerState);
      return NextResponse.json(decision);
    } catch (error) {
      console.error(`Gemini attempt ${attempts + 1} failed:`, error);
      attempts++;
    }
  }

  // Last resort fallback
  const fallback = FALLBACK_DECISIONS[playerState.currentYear];
  if (fallback) return NextResponse.json(fallback);

  return NextResponse.json(
    { error: "Failed to generate decision" },
    { status: 500 },
  );
}
