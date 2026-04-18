import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

export async function GET() {
  const leaderboard = await getCollection("leaderboard");
  const top = await leaderboard
    .find({})
    .sort({ finalNetWorth: -1 })
    .limit(10)
    .toArray();

  return NextResponse.json(top);
}
