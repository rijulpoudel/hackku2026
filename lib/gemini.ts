import { GoogleGenerativeAI } from "@google/generative-ai";
import { PlayerState, GeneratedDecision } from "@/types/game";
import { buildImageUrl } from "./image";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SCENARIO_TYPES = [
  "career",
  "lifestyle",
  "debt",
  "savings",
  "investment",
  "life-event",
  "tax",
];

function pickScenarioType(playerState: PlayerState): string {
  const recentTypes = playerState.decisions
    .slice(-3)
    .map((d) => d.scenarioType);

  if (playerState.creditCardDebt > 5000 && !recentTypes.includes("debt"))
    return "debt";
  if (!playerState.hasEmergencyFund && !recentTypes.includes("savings"))
    return "savings";
  if (!playerState.hasInvested && playerState.currentYear > 6)
    return "investment";
  if (playerState.annualSalary < 50000 && !recentTypes.includes("career"))
    return "career";

  const available = SCENARIO_TYPES.filter((t) => !recentTypes.includes(t));
  return available[Math.floor(Math.random() * available.length)] || "lifestyle";
}

export async function generateNextDecision(
  playerState: PlayerState,
): Promise<GeneratedDecision> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const scenarioType = pickScenarioType(playerState);

  const characterDesc =
    playerState.character === 'custom'
      ? playerState.isFreelancing
        ? 'custom freelancer / self-employed'
        : playerState.annualSalary >= 80000
          ? 'custom high-earning professional'
          : playerState.annualSalary >= 45000
            ? 'custom mid-career professional'
            : 'custom entry-level worker'
      : playerState.character;

  const prompt = `You are the game engine for LAUNCH, a financial life simulator for
recent college graduates. Generate a realistic financial scenario for this player.

PLAYER PROFILE:
- Character: ${characterDesc}
- Current age: ${playerState.age}
- Net worth: $${playerState.netWorth.toLocaleString()}
- Annual salary: $${playerState.annualSalary.toLocaleString()}
- Savings: $${playerState.savings.toLocaleString()}
- Student loan balance: $${playerState.loanBalance.toLocaleString()}
- Credit card debt: $${playerState.creditCardDebt.toLocaleString()}
- 401k balance: $${playerState.retirement401k.toLocaleString()}
- Owns home: ${playerState.ownsHome}
- Has emergency fund: ${playerState.hasEmergencyFund}
- Has invested: ${playerState.hasInvested}
- Took 401k match: ${playerState.took401kMatch}
- Had job loss: ${playerState.hadJobLoss}

DECISION HISTORY (do not repeat these topics):
${playerState.decisions
  .map(
    (d) =>
      `Year ${d.year}: "${d.financialTerm}" — chose "${d.choiceTitle}" (${d.choiceLabel})`,
  )
  .join("\n")}

GENERATE A SCENARIO OF TYPE: ${scenarioType}

RULES:
1. The scenario must follow logically from this player's specific history and situation
2. If player made poor choices, generate a consequence or crisis related to those choices
3. If player made good choices, generate an opportunity that rewards that behavior
4. All dollar amounts must be realistic for someone age ${playerState.age}
5. The financial concept must be real, accurate, and important
6. net_worth_change must be mathematically realistic (not random)
7. The Best/Smart choice should not be obviously labeled as such — make it require thought
8. image_prompt should describe a real human moment, NOT a financial chart

Return ONLY valid JSON. No markdown. No explanation. Exactly this structure:
{
  "scenario": "one sentence setting the scene, second person present tense, emotionally specific",
  "question": "the decision question, under 20 words",
  "financial_term": "name of the key financial concept",
  "definition": "plain English definition, max 50 words, zero jargon",
  "scenario_type": "${scenarioType}",
  "choices": [
    {
      "label": "Best",
      "title": "choice title, max 8 words",
      "impact": "specific dollar impact and timeframe",
      "lesson": "what this teaches, one specific sentence",
      "net_worth_change": 0
    },
    {
      "label": "Smart",
      "title": "choice title, max 8 words",
      "impact": "specific dollar impact",
      "lesson": "what this teaches",
      "net_worth_change": -200
    },
    {
      "label": "Risky",
      "title": "choice title, max 8 words",
      "impact": "specific dollar impact showing real cost",
      "lesson": "what this teaches about the risk",
      "net_worth_change": -1500
    }
  ],
  "image_prompt": "visual scene description, 15 words, show a person in a real moment, no charts no text",
  "fact_after": "one real statistic related to this topic, cite source, max 25 words"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "").trim();

  try {
    const decision = JSON.parse(clean) as GeneratedDecision;
    decision.image_url = buildImageUrl(decision.image_prompt);
    return decision;
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${text.slice(0, 200)}`);
  }
}

export async function generateFinalVerdict(
  playerState: PlayerState,
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const sortedByBest = [...playerState.decisions].sort(
    (a, b) => b.netWorthChange - a.netWorthChange,
  );
  const sortedByWorst = [...playerState.decisions].sort(
    (a, b) => a.netWorthChange - b.netWorthChange,
  );

  const prompt = `Write a personal financial verdict letter for ${playerState.name}.

THEIR 12-YEAR JOURNEY:
- Character: ${playerState.character}
- Final net worth: $${playerState.netWorth.toLocaleString()}
- Final 401k: $${playerState.retirement401k.toLocaleString()}
- Student loans remaining: $${playerState.loanBalance.toLocaleString()}
- Best decision: ${sortedByBest[0]?.financialTerm ?? "N/A"}
- Worst decision: ${sortedByWorst[0]?.financialTerm ?? "N/A"}
- Took 401k match: ${playerState.took401kMatch}
- Owns home: ${playerState.ownsHome}
- Has emergency fund: ${playerState.hasEmergencyFund}

Write 3 paragraphs:
1. What they did well (specific, reference their actual decisions)
2. What cost them the most (honest, not preachy, with real numbers)
3. Their projected net worth at ages 45, 55, and 65 based on current trajectory,
   and three specific actions to take in the next 30 days

Tone: like a financial advisor who actually cares. Direct. Warm. No jargon.
Keep it under 300 words. Second person. Start with their name.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
