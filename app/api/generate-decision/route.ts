import { NextRequest, NextResponse } from "next/server";
import { generateNextDecision } from "@/lib/gemini";
import { ANCHOR_DECISIONS } from "@/lib/anchor-decisions";
import { FALLBACK_DECISIONS } from "@/lib/fallback-decisions";
import { PlayerState } from "@/types/game";

export async function POST(req: NextRequest) {
  const playerState: PlayerState = await req.json();

  // Years 1-3: always use hard-coded anchor decisions
  const anchor = ANCHOR_DECISIONS[playerState.currentYear];
  if (anchor) return NextResponse.json(anchor);

  // Years 4-12: Gemini with retry logic
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

  // Fallback if Gemini fails twice
  const fallback = FALLBACK_DECISIONS[playerState.currentYear];
  if (fallback) return NextResponse.json(fallback);

  return NextResponse.json(
    { error: "Failed to generate decision" },
    { status: 500 },
  );
}
