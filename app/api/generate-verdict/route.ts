import { NextRequest, NextResponse } from "next/server";
import { generateFinalVerdict } from "@/lib/gemini";
import { getCollection } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const { playerState, userId, displayName } = await req.json();

  const verdict = await generateFinalVerdict(playerState);

  // Mark session complete
  const sessions = await getCollection("sessions");
  await sessions.updateOne(
    { userId },
    { $set: { completedAt: new Date(), finalNetWorth: playerState.netWorth } },
  );

  // Add to leaderboard
  const leaderboard = await getCollection("leaderboard");
  await leaderboard.insertOne({
    userId,
    displayName: displayName || "Anonymous Graduate",
    character: playerState.character,
    finalNetWorth: playerState.netWorth,
    completedAt: new Date(),
    decisionCount: playerState.decisions.length,
  });

  return NextResponse.json({ verdict });
}
