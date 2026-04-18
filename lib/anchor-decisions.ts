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
