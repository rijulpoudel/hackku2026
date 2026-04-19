export type CharacterType =
  | "maya"   // PhD Student → Academic/Research
  | "alex"   // Corporate Tech
  | "jordan" // Freelance Creative
  | "sam"    // Public School Teacher
  | "custom"; // Player-defined character

export type ChoiceLabel =
  | "Best"
  | "Smart"
  | "Neutral"
  | "Risky"
  | "Danger"
  | "Costly"
  | "Worst";

export interface PlayerState {
  // Identity
  userId: string;
  name: string;
  character: CharacterType;

  // Current position in game
  age: number;
  currentYear: number;

  // Financial snapshot
  netWorth: number;
  annualSalary: number;
  savings: number;
  loanBalance: number;
  retirement401k: number;
  creditCardDebt: number;
  monthlyExpenses: number;

  // Life flags
  ownsHome: boolean;
  hasEmergencyFund: boolean;
  isFreelancing: boolean;
  hasInvested: boolean;
  took401kMatch: boolean;
  filedTaxesCorrectly: boolean;
  hasNegotiatedSalary: boolean;
  hasChildren: boolean;
  hadJobLoss: boolean;

  // Character-specific flags
  isPSLFEligible: boolean;   // maya (university job) or sam
  isPensionEnrolled: boolean; // sam
  isGradStudent: boolean;     // maya
  hasLLC: boolean;            // jordan

  // Full decision history
  decisions: DecisionRecord[];
}

export interface DecisionRecord {
  year: number;
  age: number;
  scenarioType: string;
  question: string;
  choiceIndex: number;
  choiceTitle: string;
  choiceLabel: ChoiceLabel;
  netWorthChange: number;
  lesson: string;
  financialTerm: string;
}

export interface GeneratedDecision {
  scenario: string;
  question: string;
  financial_term: string;
  definition: string;
  scenario_type: string;
  choices: GeneratedChoice[];
  image_prompt: string;
  image_url?: string;
  fact_after: string;
}

export interface GeneratedChoice {
  label: ChoiceLabel;
  title: string;
  impact: string;
  lesson: string;
  net_worth_change: number;
  flag_changes?: Partial<PlayerState>;
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
