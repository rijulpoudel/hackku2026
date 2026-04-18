import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { PlayerState, DecisionRecord } from "@/types/game";

export async function POST(req: NextRequest) {
  const {
    playerState,
    decision,
    choiceIndex,
    userId,
    displayName,
  }: {
    playerState: PlayerState;
    decision: {
      scenario_type: string;
      question: string;
      financial_term: string;
      choices: Array<{
        label: string;
        title: string;
        lesson: string;
        net_worth_change: number;
      }>;
    };
    choiceIndex: number;
    userId: string;
    displayName: string;
  } = await req.json();

  const choice = decision.choices[choiceIndex];

  const record: DecisionRecord = {
    year: playerState.currentYear,
    age: playerState.age,
    scenarioType: decision.scenario_type,
    question: decision.question,
    choiceIndex,
    choiceTitle: choice.title,
    choiceLabel: choice.label as DecisionRecord["choiceLabel"],
    netWorthChange: choice.net_worth_change,
    lesson: choice.lesson,
    financialTerm: decision.financial_term,
  };

  const newNetWorth = playerState.netWorth + choice.net_worth_change;

  // Update sessions collection
  const sessions = await getCollection("sessions");
  await sessions.updateOne(
    { userId },
    {
      $set: {
        currentPlayerState: { ...playerState, netWorth: newNetWorth },
        updatedAt: new Date(),
      },
      $push: { decisions: record as any },
      $inc: { totalDecisions: 1 },
      $setOnInsert: {
        character: playerState.character,
        startedAt: new Date(),
        completedAt: null,
        finalNetWorth: null,
      },
    },
    { upsert: true },
  );

  // Save to analytics collection
  const analytics = await getCollection("analytics");
  await analytics.insertOne({
    sessionId: userId,
    year: record.year,
    age: record.age,
    character: playerState.character,
    scenarioType: record.scenarioType,
    financialTerm: record.financialTerm,
    choiceLabel: record.choiceLabel,
    netWorthChange: record.netWorthChange,
    isOptimalChoice: ["Best", "Smart"].includes(record.choiceLabel),
    createdAt: new Date(),
  });

  return NextResponse.json({
    success: true,
    newNetWorth,
    record,
  });
}
