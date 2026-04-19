# LAUNCH — Life After Graduation

## Complete Project Specification for Claude Code

---

## FINAL DECISION: What We Are Building

**LAUNCH** is a full-screen narrative financial life simulator inspired by playspent.org.
Built for the Security Benefit track at HackKU 2026.

A player just graduated college. They start at age 22 with $2,100 in savings and
$34,000 in student loans. They make financial decisions across 12 years of life
(ages 22 to 33). Every decision changes their net worth in real time. At the end,
they see their financial future and get a personalized AI report.

**The game covers (NOT just taxes):**

- Career path choices (salary negotiation, job offers, city vs hometown)
- Lifestyle decisions (rent vs buy, car choices, relationships)
- Debt management (student loans, credit cards, mortgages, refinancing)
- Savings and investments (emergency fund, 401k, index funds, Roth IRA)
- Life events (job loss, medical emergency, new baby, inheritance, promotions)
- Tax events (naturally occurring, not the focus, one scenario type among many)

**Key mechanic stolen from SPENT:** Full screen for every decision. One visible
number (net worth) that changes after every choice. Real statistics shown after
each choice. No obvious right answer — all choices have real trade-offs.

**Key improvements over SPENT:**

- Direction is upward (building wealth, not just surviving)
- Choices compound over 12 years, not just one month
- AI (Gemini) generates personalized decisions based on player history
- Images generated dynamically per decision (Pollinations.ai)
- ElevenLabs narrator speaks scene transitions
- MongoDB stores all decisions for Security Benefit analytics

---

## Tech Stack

```
Frontend:    Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion
Backend:     Next.js API Routes (same repo)
Database:    MongoDB Atlas (free tier)
AI:          Google Gemini API (gemini-2.0-flash model)
Images:      Pollinations.ai (free, no API key, URL-based)
Audio:       ElevenLabs (pre-generated MP3 files for anchors, real-time for dynamic)
Auth:        Auth0 (@auth0/nextjs-auth0)
Deploy:      Vercel (free tier, connect GitHub repo)
```

---

## Project Structure

```
launch/
├── app/
│   ├── page.tsx                    # Landing page + character select
│   ├── game/
│   │   └── page.tsx                # Main game screen
│   ├── verdict/
│   │   └── page.tsx                # Final report screen
│   └── api/
│       ├── auth/
│       │   └── [...auth0]/
│       │       └── route.ts        # Auth0 handler
│       ├── generate-decision/
│       │   └── route.ts            # Gemini decision generator
│       ├── apply-choice/
│       │   └── route.ts            # Save choice to MongoDB
│       ├── generate-verdict/
│       │   └── route.ts            # Final Gemini report
│       └── leaderboard/
│           └── route.ts            # Get/update leaderboard
├── components/
│   ├── LandingScreen.tsx           # Hero + start button
│   ├── CharacterSelect.tsx         # 4 character cards
│   ├── DecisionScreen.tsx          # Main game UI (full screen)
│   ├── ChoiceCard.tsx              # Individual choice button
│   ├── NetWorthBar.tsx             # Top bar with running total
│   ├── YearTransition.tsx          # "Year X — Age XX" animated overlay
│   ├── FactBox.tsx                 # SPENT-style fact after choice
│   ├── DecisionLoading.tsx         # Loading state between decisions
│   ├── VerdictDocument.tsx         # Final report styled as document
│   └── Leaderboard.tsx             # Global leaderboard component
├── lib/
│   ├── mongodb.ts                  # DB connection singleton
│   ├── gemini.ts                   # Gemini API wrapper + prompt
│   ├── anchor-decisions.ts         # Hard-coded Years 1-3 decisions
│   ├── fallback-decisions.ts       # Backup if Gemini fails
│   ├── financial-math.ts           # Net worth calculations
│   ├── audio.ts                    # Howler.js audio manager
│   └── image.ts                    # Pollinations.ai URL builder
├── types/
│   └── game.ts                     # All TypeScript interfaces
├── public/
│   └── audio/
│       ├── narrator-year1.mp3      # "Your first paycheck arrives..."
│       ├── narrator-year2.mp3      # "April. Tax season..."
│       ├── narrator-year3.mp3      # "Open enrollment closes Friday..."
│       ├── narrator-transition.mp3 # "X years later..."
│       ├── choice-correct.mp3      # Positive outcome sound
│       ├── choice-neutral.mp3      # Neutral outcome sound
│       └── choice-bad.mp3          # Negative outcome sound
└── .env.local                      # All secrets (never commit this)
```

---

## Environment Variables

Create `.env.local` in root. Never commit this file.

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/launch

# Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Auth0
AUTH0_SECRET=long_random_string_32_chars_minimum
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret

# ElevenLabs (for real-time generation of dynamic decisions)
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=narrator_voice_id_from_elevenlabs
```

For Vercel deployment, add all these same variables in the Vercel dashboard under
Project Settings → Environment Variables.

---

## TypeScript Interfaces

```typescript
// types/game.ts

export type CharacterType =
  | "employee"
  | "freelancer"
  | "student"
  | "side-hustler";
export type ChoiceLabel =
  | "Best"
  | "Smart"
  | "Neutral"
  | "Risky"
  | "Danger"
  | "Costly";

export interface PlayerState {
  // Identity
  userId: string; // from Auth0
  name: string;
  character: CharacterType;

  // Current position in game
  age: number; // starts 22, increments each year
  currentYear: number; // 1-12, maps to ages 22-33

  // Financial snapshot (updates after every choice)
  netWorth: number; // core number shown on screen
  annualSalary: number; // affects Gemini scenario generation
  savings: number; // liquid savings balance
  loanBalance: number; // student loan remaining
  retirement401k: number; // retirement account balance
  creditCardDebt: number; // credit card balance
  monthlyExpenses: number; // current monthly burn

  // Life flags (Gemini uses these to personalize)
  ownsHome: boolean;
  hasEmergencyFund: boolean; // 3+ months expenses saved
  isFreelancing: boolean;
  hasInvested: boolean; // opened brokerage/Roth
  took401kMatch: boolean;
  filedTaxesCorrectly: boolean;
  hasNegotiatedSalary: boolean;
  hasChildren: boolean;
  hadJobLoss: boolean;

  // Full decision history (sent to Gemini every time)
  decisions: DecisionRecord[];
}

export interface DecisionRecord {
  year: number;
  age: number;
  scenarioType: string; // 'career' | 'debt' | 'savings' | 'lifestyle' | 'tax' | 'life-event'
  question: string;
  choiceIndex: number; // 0, 1, 2, or 3
  choiceTitle: string;
  choiceLabel: ChoiceLabel;
  netWorthChange: number; // can be negative
  lesson: string; // what the player learned
  financialTerm: string;
}

export interface GeneratedDecision {
  scenario: string; // scene-setting sentence
  question: string; // the actual decision question
  financial_term: string; // key concept name
  definition: string; // plain English explanation max 50 words
  scenario_type: string; // 'career' | 'debt' | 'savings' | 'lifestyle' | 'tax' | 'life-event'
  choices: GeneratedChoice[];
  image_prompt: string; // what Pollinations.ai should draw
  image_url?: string; // built from image_prompt by backend
  fact_after: string; // SPENT-style statistic shown after choice
}

export interface GeneratedChoice {
  label: ChoiceLabel;
  title: string; // max 8 words
  impact: string; // immediate dollar/life impact
  lesson: string; // one educational sentence
  net_worth_change: number; // real number, Gemini calculates
  flag_changes?: Partial<PlayerState>; // optional flag updates
}

export interface GameSession {
  _id?: string;
  userId: string;
  character: CharacterType;
  startedAt: Date;
  completedAt?: Date;
  finalNetWorth?: number;
  totalDecisions: number;
  decisions: DecisionRecord[];
  currentPlayerState: PlayerState;
}

export interface LeaderboardEntry {
  _id?: string;
  userId: string;
  displayName: string;
  character: CharacterType;
  finalNetWorth: number;
  completedAt: Date;
  totalYears: number;
}
```

---

## MongoDB Schema

Three collections. All using MongoDB Atlas free tier.

### Collection 1: `sessions`

Stores the complete game state for every player. Updated after every single decision.

```typescript
{
  _id: ObjectId,
  userId: string,              // Auth0 user ID
  character: string,
  startedAt: Date,
  completedAt: Date | null,
  finalNetWorth: number | null,
  totalDecisions: number,
  decisions: DecisionRecord[], // full history array
  currentPlayerState: PlayerState, // latest snapshot
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `userId` (for fast user lookup)
- `completedAt` (for leaderboard queries)
- `finalNetWorth` (for leaderboard sorting)

### Collection 2: `analytics`

Stores anonymized decision data for Security Benefit pitch.
One document per decision made by any player.

```typescript
{
  _id: ObjectId,
  sessionId: string,
  year: number,
  age: number,
  character: string,
  scenarioType: string,       // 'career' | 'debt' | 'savings' etc
  financialTerm: string,
  choiceLabel: string,        // 'Best' | 'Smart' | 'Neutral' | 'Risky' | 'Danger'
  netWorthChange: number,
  isOptimalChoice: boolean,   // was this the 'Best' or 'Smart' option
  createdAt: Date
}
```

This collection answers the Security Benefit pitch question:
"Which financial decisions do graduates get wrong most often, at what age,
and in what scenarios?" This is the analytics pitch that wins the track.

### Collection 3: `leaderboard`

One document per completed game.

```typescript
{
  _id: ObjectId,
  userId: string,
  displayName: string,        // from Auth0 profile
  character: string,
  finalNetWorth: number,
  completedAt: Date,
  decisionCount: number
}
```

---

## MongoDB Connection (lib/mongodb.ts)

```typescript
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Use global singleton in dev to avoid multiple connections
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db("launch");
}

export async function getCollection(name: string) {
  const db = await getDb();
  return db.collection(name);
}
```

---

## Gemini Decision Generator (lib/gemini.ts)

````typescript
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PlayerState, GeneratedDecision } from "@/types/game";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SCENARIO_TYPES = [
  "career", // job changes, raises, negotiation, promotions
  "lifestyle", // housing, car, city, relationships, children
  "debt", // student loans, credit cards, mortgages, medical debt
  "savings", // emergency fund, 401k, index funds, Roth IRA
  "investment", // market events, portfolio decisions, real estate
  "life-event", // job loss, inheritance, medical emergency, divorce
  "tax", // annual filing, deductions, 1099, self-employment
];

// Pick scenario type not recently used, weighted by what player needs most
function pickScenarioType(playerState: PlayerState): string {
  const recentTypes = playerState.decisions
    .slice(-3)
    .map((d) => d.scenarioType);

  // Priority logic: if player has problems, address them
  if (playerState.creditCardDebt > 5000 && !recentTypes.includes("debt"))
    return "debt";
  if (!playerState.hasEmergencyFund && !recentTypes.includes("savings"))
    return "savings";
  if (!playerState.hasInvested && playerState.currentYear > 6)
    return "investment";
  if (playerState.annualSalary < 50000 && !recentTypes.includes("career"))
    return "career";

  // Otherwise rotate through types not recently used
  const available = SCENARIO_TYPES.filter((t) => !recentTypes.includes(t));
  return available[Math.floor(Math.random() * available.length)] || "lifestyle";
}

export async function generateNextDecision(
  playerState: PlayerState,
): Promise<GeneratedDecision> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const scenarioType = pickScenarioType(playerState);

  const prompt = `You are the game engine for LAUNCH, a financial life simulator for 
recent college graduates. Generate a realistic financial scenario for this player.

PLAYER PROFILE:
- Character: ${playerState.character} (employee / freelancer / student / side-hustler)
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
    // Add image URL
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

  const prompt = `Write a personal financial verdict letter for ${playerState.name}.

THEIR 12-YEAR JOURNEY:
- Character: ${playerState.character}
- Final net worth: $${playerState.netWorth.toLocaleString()}
- Final 401k: $${playerState.retirement401k.toLocaleString()}
- Student loans remaining: $${playerState.loanBalance.toLocaleString()}
- Best decision: ${playerState.decisions.sort((a, b) => b.netWorthChange - a.netWorthChange)[0]?.financialTerm}
- Worst decision: ${playerState.decisions.sort((a, b) => a.netWorthChange - b.netWorthChange)[0]?.financialTerm}
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
````

---

## Pollinations.ai Image Builder (lib/image.ts)

```typescript
// No API key needed. Free. Works as a simple URL.
export function buildImageUrl(prompt: string): string {
  const styleAddition =
    ", flat digital illustration, warm muted colors, no text in image, clean lines, financial life moment";
  const fullPrompt = prompt + styleAddition;
  const encoded = encodeURIComponent(fullPrompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=450&nologo=true&seed=${Date.now()}`;
}
```

---

## Hard-Coded Anchor Decisions (lib/anchor-decisions.ts)

These run in Years 1, 2, and 3 — always, for every player.
They cover the three must-know concepts: withholding, taxes, 401k.

```typescript
import { GeneratedDecision } from "@/types/game";
import { buildImageUrl } from "./image";

export const ANCHOR_DECISIONS: Record<number, GeneratedDecision> = {
  1: {
    scenario:
      "Your first paycheck arrives. It's $380 less than you expected every month.",
    question: "What do you do about the missing $380?",
    financial_term: "W-4 and Tax Withholding",
    definition:
      "Your W-4 tells your employer how much tax to take from each paycheck. Wrong settings mean too much or too little withheld all year — and a surprise in April.",
    scenario_type: "tax",
    choices: [
      {
        label: "Best",
        title: "Go to HR and update W-4 today",
        impact: "Correct take-home starting next paycheck",
        lesson:
          "You control your withholding. Review your W-4 every time your life changes.",
        net_worth_change: 200,
      },
      {
        label: "Neutral",
        title: "Wait until tax season to sort it out",
        impact: "Overpay all year, get a refund in April",
        lesson:
          "A big refund means you gave the government a free loan all year.",
        net_worth_change: 0,
      },
      {
        label: "Risky",
        title: "Assume it's correct and move on",
        impact: "Risk owing money in April plus penalties",
        lesson: "Ignoring withholding is a mistake that compounds monthly.",
        net_worth_change: -400,
      },
    ],
    image_prompt:
      "young professional looking at first paycheck stub with surprised expression at office desk",
    image_url: buildImageUrl(
      "young professional looking at first paycheck stub with surprised expression at office desk",
    ),
    fact_after:
      "The average American's first paycheck surprises them by $300-600. 78% of workers never update their W-4 after being hired. — IRS",
  },
  2: {
    scenario:
      "April 14th. Your tax forms are on the table. You have never filed before.",
    question: "How do you handle your first ever tax return?",
    financial_term: "Filing Your Taxes — The W-2 Form",
    definition:
      "Your W-2 shows total earnings and taxes withheld. You file a return by April 15th to confirm what you owe or what you get back. Free software makes this a 45-minute task.",
    scenario_type: "tax",
    choices: [
      {
        label: "Best",
        title: "File free with IRS Free File software",
        impact: "$0 cost. Done correctly in 45 minutes. Refund in 10 days.",
        lesson:
          "IRS Free File is free for incomes under $73,000. Use it every year.",
        net_worth_change: 1200,
      },
      {
        label: "Smart",
        title: "Pay H&R Block or CPA ($200-350)",
        impact: "Done correctly. Higher cost than necessary for simple return.",
        lesson:
          "Worth it if you have freelance income, investments, or major life changes.",
        net_worth_change: 1000,
      },
      {
        label: "Danger",
        title: "Skip filing this year entirely",
        impact:
          "5% penalty per month on any amount owed. Criminal charges after 3 years.",
        lesson:
          "Not filing is illegal. The IRS already has your W-2. They will find you.",
        net_worth_change: -800,
      },
    ],
    image_prompt:
      "person at kitchen table with W-2 tax form and laptop, nervous but focused, first time filing taxes",
    image_url: buildImageUrl(
      "person at kitchen table with W-2 tax form and laptop nervous but focused first time filing",
    ),
    fact_after:
      "The IRS processes 160 million returns per year. Over 15 million Americans miss the April deadline. Late penalty is 5% per month up to 25% of unpaid tax. — IRS 2024",
  },
  3: {
    scenario:
      "Open enrollment closes Friday. Your 401k form has been sitting in your email for three weeks.",
    question:
      "Do you finally enroll in your company 401k with 5% employer match?",
    financial_term:
      "401k Employer Match — The Most Important Decision of Your 20s",
    definition:
      "Your employer adds free money matching your 401k contributions up to a percentage. On a $45k salary with 5% match, they add $2,250/year free. At 7% growth over 30 years, that $2,250/year becomes $226,000.",
    scenario_type: "savings",
    choices: [
      {
        label: "Best",
        title: "Contribute 5% — get the full employer match",
        impact: "$2,250/year free from employer. $226,000 at retirement.",
        lesson:
          "An employer match is an immediate 100% return on your money. Nothing beats it.",
        net_worth_change: 4500,
      },
      {
        label: "Neutral",
        title: "Contribute 3% — partial match only",
        impact: "Get partial match. Leave $900/year in free money on table.",
        lesson: "Better than nothing. But increase to 5% as soon as possible.",
        net_worth_change: 2700,
      },
      {
        label: "Worst",
        title: "Skip enrollment again — you need the money now",
        impact: "Lose $2,250 employer match this year. Every year.",
        lesson:
          "The cost is not $2,250 once. Missing 30 years of compound growth = $226,000 gone.",
        net_worth_change: 0,
      },
    ],
    image_prompt:
      "person at work computer staring at 401k enrollment form hesitating with mouse cursor over submit button",
    image_url: buildImageUrl(
      "person at work computer staring at 401k enrollment form hesitating with mouse cursor over submit",
    ),
    fact_after:
      "55% of Americans with access to a 401k do not contribute enough to get the full employer match. This leaves an average $1,336/year in free money unclaimed. — Vanguard 2024",
  },
};
```

---

## API Routes

### POST /api/generate-decision

```typescript
// app/api/generate-decision/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import { generateNextDecision } from "@/lib/gemini";
import { ANCHOR_DECISIONS } from "@/lib/anchor-decisions";
import { FALLBACK_DECISIONS } from "@/lib/fallback-decisions";
import { PlayerState } from "@/types/game";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  return NextResponse.json(fallback);
}
```

### POST /api/apply-choice

```typescript
// app/api/apply-choice/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import { getCollection } from "@/lib/mongodb";
import { PlayerState, DecisionRecord } from "@/types/game";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    playerState,
    decision,
    choiceIndex,
  }: {
    playerState: PlayerState;
    decision: any;
    choiceIndex: number;
  } = await req.json();

  const choice = decision.choices[choiceIndex];

  // Build decision record
  const record: DecisionRecord = {
    year: playerState.currentYear,
    age: playerState.age,
    scenarioType: decision.scenario_type,
    question: decision.question,
    choiceIndex,
    choiceTitle: choice.title,
    choiceLabel: choice.label,
    netWorthChange: choice.net_worth_change,
    lesson: choice.lesson,
    financialTerm: decision.financial_term,
  };

  // Apply net worth change
  const newNetWorth = playerState.netWorth + choice.net_worth_change;

  // Update sessions collection
  const sessions = await getCollection("sessions");
  await sessions.updateOne(
    { userId: session.user.sub },
    {
      $set: {
        currentPlayerState: { ...playerState, netWorth: newNetWorth },
        updatedAt: new Date(),
      },
      $push: { decisions: record },
      $inc: { totalDecisions: 1 },
    },
    { upsert: true },
  );

  // Save to analytics collection (anonymized)
  const analytics = await getCollection("analytics");
  await analytics.insertOne({
    sessionId: session.user.sub,
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
```

### POST /api/generate-verdict

```typescript
// app/api/generate-verdict/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import { generateFinalVerdict } from "@/lib/gemini";
import { getCollection } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { playerState } = await req.json();

  const verdict = await generateFinalVerdict(playerState);

  // Mark session complete + add to leaderboard
  const sessions = await getCollection("sessions");
  await sessions.updateOne(
    { userId: session.user.sub },
    { $set: { completedAt: new Date(), finalNetWorth: playerState.netWorth } },
  );

  const leaderboard = await getCollection("leaderboard");
  await leaderboard.insertOne({
    userId: session.user.sub,
    displayName: session.user.name || "Anonymous Graduate",
    character: playerState.character,
    finalNetWorth: playerState.netWorth,
    completedAt: new Date(),
    decisionCount: playerState.decisions.length,
  });

  return NextResponse.json({ verdict });
}
```

### GET /api/leaderboard

```typescript
// app/api/leaderboard/route.ts
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
```

---

## Frontend Components

### Game State Management (app/game/page.tsx)

```typescript
'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { DecisionScreen } from '@/components/DecisionScreen'
import { YearTransition } from '@/components/YearTransition'
import { DecisionLoading } from '@/components/DecisionLoading'
import { NetWorthBar } from '@/components/NetWorthBar'
import { FactBox } from '@/components/FactBox'
import { PlayerState, GeneratedDecision } from '@/types/game'
import { playAudio } from '@/lib/audio'
import { useRouter } from 'next/navigation'

type GamePhase =
  | 'transition'    // "Year X — Age XX" overlay
  | 'loading'       // waiting for Gemini
  | 'decision'      // showing the decision + choices
  | 'fact'          // post-choice fact box
  | 'complete'      // go to verdict

const INITIAL_STATE: PlayerState = {
  userId: '',
  name: '',
  character: 'employee',
  age: 22,
  currentYear: 1,
  netWorth: -31900,  // $2,100 savings - $34,000 loans
  annualSalary: 45000,
  savings: 2100,
  loanBalance: 34000,
  retirement401k: 0,
  creditCardDebt: 0,
  monthlyExpenses: 2800,
  ownsHome: false,
  hasEmergencyFund: false,
  isFreelancing: false,
  hasInvested: false,
  took401kMatch: false,
  filedTaxesCorrectly: false,
  hasNegotiatedSalary: false,
  hasChildren: false,
  hadJobLoss: false,
  decisions: []
}

export default function GamePage() {
  const { user } = useUser()
  const router = useRouter()
  const [phase, setPhase] = useState<GamePhase>('transition')
  const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_STATE)
  const [currentDecision, setCurrentDecision] = useState<GeneratedDecision | null>(null)
  const [chosenIndex, setChosenIndex] = useState<number | null>(null)
  const [netWorthDelta, setNetWorthDelta] = useState(0)

  // Fetch next decision from API
  async function fetchNextDecision(state: PlayerState) {
    setPhase('loading')
    const res = await fetch('/api/generate-decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    })
    const decision = await res.json()
    setCurrentDecision(decision)

    // Play ElevenLabs audio if anchor year
    if (state.currentYear <= 3) {
      playAudio(`narrator-year${state.currentYear}`)
    }

    setPhase('decision')
  }

  // Handle player making a choice
  async function handleChoice(choiceIndex: number) {
    if (!currentDecision) return
    setChosenIndex(choiceIndex)

    const choice = currentDecision.choices[choiceIndex]
    const delta = choice.net_worth_change
    setNetWorthDelta(delta)

    // Play audio feedback
    if (['Best', 'Smart'].includes(choice.label)) playAudio('choice-correct')
    else if (choice.label === 'Neutral') playAudio('choice-neutral')
    else playAudio('choice-bad')

    // Save to DB and update state
    const res = await fetch('/api/apply-choice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerState, decision: currentDecision, choiceIndex })
    })
    const { newNetWorth, record } = await res.json()

    const newState = {
      ...playerState,
      netWorth: newNetWorth,
      decisions: [...playerState.decisions, record]
    }
    setPlayerState(newState)

    setPhase('fact')
  }

  // After fact box — advance to next year
  async function handleContinue() {
    const nextYear = playerState.currentYear + 1

    if (nextYear > 12) {
      // Game complete — go to verdict
      router.push('/verdict')
      return
    }

    const newState = {
      ...playerState,
      currentYear: nextYear,
      age: playerState.age + 1
    }
    setPlayerState(newState)
    setCurrentDecision(null)
    setChosenIndex(null)

    setPhase('transition')
    // Year transition overlay shows for 2 seconds then loads
    setTimeout(() => fetchNextDecision(newState), 2000)
  }

  // Initial load
  useEffect(() => {
    if (user) {
      const stateWithUser = { ...INITIAL_STATE, userId: user.sub || '', name: user.name || '' }
      setPlayerState(stateWithUser)
      setTimeout(() => fetchNextDecision(stateWithUser), 2000)
    }
  }, [user])

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white relative">
      <NetWorthBar
        netWorth={playerState.netWorth}
        year={playerState.currentYear}
        age={playerState.age}
        delta={netWorthDelta}
      />

      {phase === 'transition' && (
        <YearTransition year={playerState.currentYear} age={playerState.age} />
      )}

      {phase === 'loading' && (
        <DecisionLoading age={playerState.age} />
      )}

      {phase === 'decision' && currentDecision && (
        <DecisionScreen
          decision={currentDecision}
          onChoice={handleChoice}
          chosenIndex={chosenIndex}
        />
      )}

      {phase === 'fact' && currentDecision && chosenIndex !== null && (
        <FactBox
          fact={currentDecision.fact_after}
          choice={currentDecision.choices[chosenIndex]}
          onContinue={handleContinue}
          netWorthDelta={netWorthDelta}
        />
      )}
    </div>
  )
}
```

### DecisionScreen Component

```typescript
// components/DecisionScreen.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { GeneratedDecision } from '@/types/game'
import { ChoiceCard } from './ChoiceCard'
import { useState } from 'react'

interface Props {
  decision: GeneratedDecision
  onChoice: (index: number) => void
  chosenIndex: number | null
}

export function DecisionScreen({ decision, onChoice, chosenIndex }: Props) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">

      {/* Full-bleed image with overlay */}
      <div className="absolute inset-0 z-0">
        {decision.image_url && (
          <motion.img
            src={decision.image_url}
            alt="Decision scene"
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: imgLoaded ? 0.35 : 0 }}
            onLoad={() => setImgLoaded(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/60 via-[#1a1a1a]/40 to-[#1a1a1a]/95" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen px-6 pt-24 pb-8 max-w-2xl mx-auto w-full">

        {/* Financial term badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block self-start mb-4"
        >
          <span className="text-xs font-medium tracking-widest text-amber-400 uppercase border border-amber-400/30 rounded px-3 py-1">
            {decision.financial_term}
          </span>
        </motion.div>

        {/* Definition */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-400 mb-6 max-w-md leading-relaxed"
        >
          {decision.definition}
        </motion.p>

        {/* Scenario */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-light leading-snug mb-3 text-white"
        >
          {decision.scenario}
        </motion.p>

        {/* Question */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-lg font-medium text-gray-200 mb-8"
        >
          {decision.question}
        </motion.h2>

        {/* Choices */}
        <div className="flex flex-col gap-3 mt-auto">
          {decision.choices.map((choice, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.1 }}
            >
              <ChoiceCard
                choice={choice}
                index={i}
                onSelect={() => chosenIndex === null && onChoice(i)}
                isChosen={chosenIndex === i}
                isDisabled={chosenIndex !== null && chosenIndex !== i}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### NetWorthBar Component

```typescript
// components/NetWorthBar.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Props {
  netWorth: number
  year: number
  age: number
  delta: number
}

export function NetWorthBar({ netWorth, year, age, delta }: Props) {
  const [prevNetWorth, setPrevNetWorth] = useState(netWorth)
  const [showDelta, setShowDelta] = useState(false)

  useEffect(() => {
    if (delta !== 0) {
      setShowDelta(true)
      setTimeout(() => setShowDelta(false), 2000)
    }
    setPrevNetWorth(netWorth)
  }, [netWorth, delta])

  const isNegative = netWorth < 0

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#1a1a1a]/90 backdrop-blur border-b border-white/5">
      <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">
        Year {year} · Age {age}
      </span>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {showDelta && delta !== 0 && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm font-medium ${delta > 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {delta > 0 ? '+' : ''}{delta.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
            </motion.span>
          )}
        </AnimatePresence>

        <motion.span
          key={netWorth}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 0.4 }}
          className={`text-lg font-semibold tabular-nums ${isNegative ? 'text-red-400' : 'text-white'}`}
        >
          {netWorth.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
        </motion.span>

        <span className="text-xs text-gray-500">net worth</span>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-white/5 w-full">
        <motion.div
          className="h-full bg-amber-400/60"
          animate={{ width: `${(year / 12) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
```

---

## Audio Manager (lib/audio.ts)

```typescript
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
```

---

## Financial Math (lib/financial-math.ts)

```typescript
// Real financial calculations used in the game

// Compound interest: how much does $principal grow in N years at rate R?
export function compoundGrowth(
  principal: number,
  annualRate: number,
  years: number,
): number {
  return Math.round(principal * Math.pow(1 + annualRate, years));
}

// Loan amortization: monthly payment on a loan
export function monthlyPayment(
  principal: number,
  annualRate: number,
  years: number,
): number {
  const r = annualRate / 12;
  const n = years * 12;
  return Math.round(
    (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1),
  );
}

// Total interest paid on a loan over its life
export function totalInterest(
  principal: number,
  annualRate: number,
  years: number,
): number {
  const payment = monthlyPayment(principal, annualRate, years);
  return Math.round(payment * years * 12 - principal);
}

// Net worth projection at retirement (age 65) from current state
export function projectRetirement(
  currentAge: number,
  current401k: number,
  monthlyContribution: number,
  annualReturn = 0.07,
): number {
  const yearsToRetirement = 65 - currentAge;
  const monthlyRate = annualReturn / 12;
  const months = yearsToRetirement * 12;

  // Future value of existing balance
  const existingGrowth =
    current401k * Math.pow(1 + annualReturn, yearsToRetirement);

  // Future value of ongoing contributions
  const contributionGrowth =
    monthlyContribution *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  return Math.round(existingGrowth + contributionGrowth);
}

// Annual 401k contribution that would give full employer match
export function fullMatchContribution(
  salary: number,
  matchPercent = 0.05,
): number {
  return Math.round(salary * matchPercent);
}
```

---

## Task Division for 3 People

### Person 1 — Frontend (Rijul)

**Branch:** `rijul/frontend`

**Owns:**

- `app/page.tsx` (landing + character select)
- `app/game/page.tsx` (game state machine)
- `app/verdict/page.tsx` (final report)
- All files in `components/`
- `lib/audio.ts`

**Day timeline:**

- Hours 0-2: Character select screen + basic game layout (no data yet)
- Hours 2-5: `DecisionScreen` with placeholder data, `NetWorthBar`, animations
- Hours 5-10: Wire to real API calls from Person 2, `YearTransition`, `FactBox`
- Hours 10-14: `VerdictDocument` screen, `Leaderboard` component
- Hours 14-18: Polish all animations, image loading states, audio triggers
- Hours 18-22: Bug fixes, mobile responsiveness, demo prep

**Starter command:**

```bash
git checkout -b rijul/frontend
npm run dev
```

---

### Person 2 — Backend + AI

**Branch:** `person2/backend`

**Owns:**

- All files in `app/api/`
- `lib/mongodb.ts`
- `lib/gemini.ts`
- `lib/anchor-decisions.ts`
- `lib/fallback-decisions.ts`
- `lib/financial-math.ts`
- `lib/image.ts`
- `types/game.ts`

**Day timeline:**

- Hours 0-2: MongoDB connection + all TypeScript types defined
- Hours 2-5: `/api/generate-decision` route with Gemini working, test in isolation
- Hours 5-8: `/api/apply-choice` route saving to all MongoDB collections
- Hours 8-12: `/api/generate-verdict` route, `/api/leaderboard` route
- Hours 12-16: Gemini prompt tuning, fallback decisions for Years 4-12, retry logic
- Hours 16-20: Test full game loop end to end, fix edge cases
- Hours 20-22: Analytics verification (check MongoDB has data for pitch)

**Test Gemini locally first:**

```bash
# Test decision generation before integrating
curl -X POST http://localhost:3000/api/generate-decision \
  -H "Content-Type: application/json" \
  -d '{"currentYear": 4, "age": 25, "netWorth": 5000, "decisions": []}'
```

---

### Person 3 — Audio, Assets, Deployment

**Branch:** `person3/assets`

**Owns:**

- All files in `public/audio/`
- Auth0 setup and configuration
- Vercel deployment
- Devpost submission
- Demo video
- Pitch script

**Day timeline:**

- Hours 0-2: Auth0 account setup, configure in `.env.local`, test login
- Hours 2-5: ElevenLabs — generate all audio clips (list below)
- Hours 5-8: Test audio in Person 1's frontend, fix any loading issues
- Hours 8-12: Vercel deployment connected to GitHub, environment variables set
- Hours 12-16: Generate all Pollinations.ai preview images for anchor decisions, test
- Hours 16-20: Devpost write-up (title, description, screenshots, video link)
- Hours 20-22: Record 90-second demo video, practice pitch, backup all assets

**ElevenLabs audio clips to generate (paste into elevenlabs.io):**

Voice settings: Stability 55, Clarity 75. Use a calm, warm, documentary narrator voice.

```
narrator-year1: "Your first paycheck arrives. It is three hundred and eighty dollars
less than you expected every single month."

narrator-year2: "April fourteenth. Your tax forms are on the table. You have never
filed before. The deadline is tomorrow."

narrator-year3: "Open enrollment closes Friday. Your four-oh-one-kay form has been
sitting in your inbox for three weeks."

narrator-transition: "Time passes. The choices you made are already compounding."

choice-correct: short positive chime sound (from freesound.org "success chime")
choice-neutral: neutral click sound (from freesound.org "soft click")
choice-bad: low soft tone (from freesound.org "low warning tone")
```

---

## GitHub Workflow (3 People, 24 Hours)

### Setup (Everyone does this first — Hours 0 to 0.5)

```bash
# Clone the existing repo
git clone https://github.com/YOUR_REPO/launch.git
cd launch

# Install dependencies
npm install framer-motion howler @google/generative-ai mongodb @auth0/nextjs-auth0
npm install --save-dev @types/howler

# Create your personal branch
git checkout -b YOUR_NAME/your-area
# Examples:
# git checkout -b rijul/frontend
# git checkout -b alex/backend
# git checkout -b sam/assets
```

### Daily Loop (Every Person, Every 2 Hours)

```bash
# Save your work
git add .
git commit -m "feat: [what you built, specific]"
# Good: "feat: add DecisionScreen with image loading and choice cards"
# Bad: "update"

# Push to your branch
git push origin YOUR_NAME/your-area
```

### Merging (When a Feature is Complete and Tested)

```bash
# First pull latest main to avoid conflicts
git fetch origin
git merge origin/main

# Fix any conflicts (ask the other person if you conflict on the same file)
# Then push and create a Pull Request on GitHub

git push origin YOUR_NAME/your-area
# Go to GitHub → New Pull Request → merge into main
```

### When You Need Someone Else's Code

```bash
# Pull the latest from their branch without switching
git fetch origin
git merge origin/THEIR_NAME/their-area

# Or cherry-pick a specific commit
git cherry-pick COMMIT_HASH
```

### Critical Files — Do Not Both Edit At Once

| File                | Owner        | Others must ask first               |
| ------------------- | ------------ | ----------------------------------- |
| `types/game.ts`     | Person 2     | Always ask Person 2 before changing |
| `app/game/page.tsx` | Person 1     | Ask Person 1                        |
| `.env.local`        | Never commit | Share values via Discord/WhatsApp   |

### Commit Message Format

```
feat: add X feature
fix: resolve Y bug
chore: update Z config
wip: [description] - DO NOT MERGE
```

### If You Break Main

```bash
# Find the last good commit
git log --oneline

# Reset main to that commit (BE CAREFUL)
git revert COMMIT_HASH

# Or if it's truly broken
git reset --hard LAST_GOOD_COMMIT_HASH
git push origin main --force  # only if all three agree
```

---

## Installation (Run Once at Start)

```bash
npx create-next-app@latest launch --typescript --tailwind --app
cd launch
npm install framer-motion
npm install howler @types/howler
npm install mongodb
npm install @auth0/nextjs-auth0
npm install @google/generative-ai
npm install @google-cloud/vision  # not needed, remove this line
```

---

## Pre-Demo Checklist (Hour 22-24)

- [ ] Game plays through all 12 years without crashing
- [ ] Gemini generates unique decisions (test with two different characters)
- [ ] Images load from Pollinations.ai (check network tab)
- [ ] Audio plays on Year 1, 2, 3 transitions
- [ ] Net worth updates after every choice
- [ ] MongoDB has data (check Atlas dashboard)
- [ ] Final verdict generates successfully
- [ ] Leaderboard shows completed games
- [ ] Auth0 login works
- [ ] Deployed to Vercel with live URL
- [ ] Devpost submitted with GitHub link and video

---

## Security Benefit Pitch Points

Use these exact phrases during the pitch:

1. **The problem:** "86% of graduates say they wish they had learned financial decision-making before making real mistakes. LAUNCH gives them 12 years of experience in 15 minutes."

2. **The tech:** "Every scenario after Year 3 is dynamically generated by Gemini AI based on the player's unique history. A player deep in debt gets debt management scenarios. A player doing well gets opportunity scenarios. It is not a quiz. It adapts."

3. **The data:** "Every single decision is stored in MongoDB. After 500 players, Security Benefit will know exactly which financial events graduates handle worst, at what age, broken down by character type. That is curriculum data you cannot buy."

4. **The story:** "We built this because we are those graduates. First-generation students, international students, gig workers — people who got a diploma and a $34,000 loan and zero instruction on what to do next. We built the game we needed."

5. **The ask:** "LAUNCH is not just a hackathon project. This is the product Security Benefit should put in front of every new graduate client."

---

## What LAUNCH Is NOT

To keep scope tight for 24 hours, explicitly do not build:

- No real-time multiplayer
- No actual financial account integration
- No mobile native app (web on mobile is fine)
- No more than 12 years of gameplay
- No admin dashboard (MongoDB Atlas dashboard is enough)
- No social sharing (add this if time allows, not required)
- No payment processing of any kind
