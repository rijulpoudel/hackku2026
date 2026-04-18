import { GeneratedDecision } from "@/types/game";
import { buildImageUrl } from "./image";

// Fallback decisions for Years 4-12 if Gemini fails
export const FALLBACK_DECISIONS: Record<number, GeneratedDecision> = {
  4: {
    scenario:
      "You've been at your job two years. A recruiter contacts you with an offer 20% higher.",
    question: "Do you take the new job or use the offer to negotiate a raise?",
    financial_term: "Salary Negotiation",
    definition:
      "Most employers expect negotiation. Asking for more money rarely costs you the job, but staying silent permanently caps your earnings. Every dollar you negotiate now compounds over your entire career.",
    scenario_type: "career",
    choices: [
      {
        label: "Best",
        title: "Counter your current employer with the offer",
        impact: "$9,000/year raise if they match. Career capital either way.",
        lesson:
          "Use competing offers as leverage. Switching jobs every 2-3 years is the fastest way to grow salary.",
        net_worth_change: 6000,
      },
      {
        label: "Smart",
        title: "Accept the new job immediately",
        impact: "$9,000/year increase. Fresh start with momentum.",
        lesson: "Job-hopping is how most people get 20%+ raises. It works.",
        net_worth_change: 4500,
      },
      {
        label: "Risky",
        title: "Decline without negotiating — you like it here",
        impact: "Stay at same salary. Miss $9,000/year.",
        lesson:
          "Loyalty rarely pays as well as leverage. Your employer is not your friend.",
        net_worth_change: -2000,
      },
    ],
    image_prompt:
      "young professional on phone call with laptop open showing job offer email, looking conflicted",
    image_url: buildImageUrl(
      "young professional on phone call with laptop open showing job offer email looking conflicted",
    ),
    fact_after:
      "People who switch jobs earn 50% more over their careers than those who stay. The average raise for staying at a company is 3%. — LinkedIn 2024",
  },
  5: {
    scenario:
      "Your emergency fund is empty. Your car needs $2,800 in repairs or it stops working.",
    question: "How do you cover the $2,800 car repair?",
    financial_term: "Emergency Fund",
    definition:
      "An emergency fund is 3-6 months of expenses kept in a savings account — not invested. It exists so unexpected costs don't become debt. Without one, every crisis becomes a financial crisis.",
    scenario_type: "savings",
    choices: [
      {
        label: "Best",
        title: "Pay cash from savings, rebuild the fund",
        impact: "No debt. Cost is exactly $2,800.",
        lesson:
          "This is exactly what an emergency fund is for. Rebuild it to $8,400 before investing more.",
        net_worth_change: -2800,
      },
      {
        label: "Smart",
        title: "0% APR credit card, pay in 12 months",
        impact: "Pay $233/month. $0 interest if paid off in time.",
        lesson:
          "0% APR offers are valid tools — but only if you pay in full before the rate expires.",
        net_worth_change: -2800,
      },
      {
        label: "Danger",
        title: "Put it on a regular credit card",
        impact: "At 22% APR, $2,800 becomes $3,416 after a year of minimum payments.",
        lesson:
          "Credit card debt at 22% APR is the fastest way to lose wealth. Avoid it at all costs.",
        net_worth_change: -3500,
      },
    ],
    image_prompt:
      "person standing next to broken down car on road looking stressed calling for help",
    image_url: buildImageUrl(
      "person standing next to broken down car on road looking stressed calling for help",
    ),
    fact_after:
      "40% of Americans cannot cover a $400 emergency without going into debt. The average car repair costs $500-$1,500. A single breakdown destroys most people's savings. — Federal Reserve 2024",
  },
  6: {
    scenario:
      "You're 27. You've been renting for 5 years. Everyone says you're throwing money away.",
    question: "Do you buy your first home now or keep renting?",
    financial_term: "Rent vs. Buy",
    definition:
      "Buying builds equity but costs more upfront and ties up capital. Renting preserves flexibility and liquidity. The right answer depends on your timeline, job stability, and local market — not what your parents think.",
    scenario_type: "lifestyle",
    choices: [
      {
        label: "Smart",
        title: "Buy if you plan to stay 5+ years in this city",
        impact: "Down payment $40,000. Build $200,000 equity over 10 years.",
        lesson:
          "Buying only beats renting if you stay long enough. Move within 3 years and you likely lose money.",
        net_worth_change: 5000,
      },
      {
        label: "Neutral",
        title: "Keep renting — you might move in 2 years",
        impact: "Flexibility preserved. No equity building.",
        lesson:
          "Renting is not throwing money away. It is paying for flexibility, which has real value.",
        net_worth_change: 0,
      },
      {
        label: "Risky",
        title: "Buy now with 3% down — stretch your budget",
        impact: "PMI adds $150/month. Cash-strapped for 2+ years.",
        lesson:
          "Less than 20% down means paying PMI — insurance that protects the bank, not you.",
        net_worth_change: -3000,
      },
    ],
    image_prompt:
      "couple standing in front of house with real estate agent holding clipboard looking uncertain",
    image_url: buildImageUrl(
      "couple standing in front of house with real estate agent holding clipboard looking uncertain",
    ),
    fact_after:
      "The break-even point for buying vs. renting is typically 4-7 years. Moving before that point usually means losing money on the transaction costs alone. — Zillow 2024",
  },
  7: {
    scenario:
      "Your student loans hit year 7. You have $22,000 left at 6.8% interest.",
    question: "How do you tackle the remaining student loan balance?",
    financial_term: "Student Loan Refinancing",
    definition:
      "Refinancing replaces your current loan with a new one at a lower rate, saving money on interest. But refinancing federal loans to private means losing income-driven repayment and forgiveness options forever.",
    scenario_type: "debt",
    choices: [
      {
        label: "Best",
        title: "Refinance to 4.5% — pay off aggressively",
        impact: "Save $3,200 in interest. Paid off in 3 years.",
        lesson:
          "If you have stable income and won't pursue forgiveness, refinancing is free money.",
        net_worth_change: 3200,
      },
      {
        label: "Smart",
        title: "Stay federal, enroll in income-driven repayment",
        impact: "Lower monthly payments. Potential forgiveness after 20 years.",
        lesson:
          "IDR plans protect you if your income drops. Don't give up federal protections lightly.",
        net_worth_change: 1000,
      },
      {
        label: "Neutral",
        title: "Keep current payments, do nothing new",
        impact: "Paid off in 5 more years. Extra $4,800 in interest.",
        lesson: "Inaction with debt is a choice. You are choosing to pay more.",
        net_worth_change: -1500,
      },
    ],
    image_prompt:
      "person at desk reviewing loan statements with calculator and laptop open to refinancing site",
    image_url: buildImageUrl(
      "person at desk reviewing loan statements with calculator and laptop open to refinancing site",
    ),
    fact_after:
      "The average student loan borrower takes 20 years to pay off their debt. Refinancing at a 2% lower rate on a $30,000 loan saves approximately $3,600 in total interest. — Education Data Initiative 2024",
  },
  8: {
    scenario:
      "You're 29. Your company stock vested — you have $15,000 in a single stock.",
    question: "What do you do with $15,000 in company stock?",
    financial_term: "Diversification and Concentration Risk",
    definition:
      "Holding too much of a single stock is concentration risk. If that company fails, your investment fails. Diversification spreads risk across hundreds of companies — the same reason you don't bet your savings on one horse.",
    scenario_type: "investment",
    choices: [
      {
        label: "Best",
        title: "Sell and diversify into index funds",
        impact: "Protect gains. Spread risk across 500+ companies.",
        lesson:
          "No matter how much you love your employer, nobody's job is safe enough to also be their entire investment.",
        net_worth_change: 2000,
      },
      {
        label: "Neutral",
        title: "Keep half, sell half into index funds",
        impact: "Balanced approach. Still exposed to company risk on $7,500.",
        lesson: "A reasonable compromise — but track it and don't let it grow.",
        net_worth_change: 500,
      },
      {
        label: "Risky",
        title: "Keep all of it — the stock is going up",
        impact: "Risk losing everything if the stock drops 50%.",
        lesson:
          "Enron employees kept company stock and lost everything. Your company is not different.",
        net_worth_change: -3000,
      },
    ],
    image_prompt:
      "person looking at stock portfolio chart on phone looking excited but uncertain about decision",
    image_url: buildImageUrl(
      "person looking at stock portfolio chart on phone looking excited but uncertain about decision",
    ),
    fact_after:
      "Employees who hold more than 10% of their net worth in company stock have 3x higher financial risk. 60% of company bankruptcies wipe out employee stock options entirely. — Vanguard Research 2024",
  },
  9: {
    scenario:
      "You're 30. A job offer comes with a $15,000 signing bonus — but requires repayment if you leave in 2 years.",
    question: "Do you take the signing bonus job?",
    financial_term: "Signing Bonus Clawback",
    definition:
      "Many signing bonuses include clawback clauses requiring repayment if you leave before a set date. Always read the terms — a $15,000 bonus with a 2-year clawback can become a $15,000 debt if you find a better offer.",
    scenario_type: "career",
    choices: [
      {
        label: "Best",
        title: "Take it — but read the clawback terms carefully",
        impact: "$15,000 cash now. Stay 2 years or repay it.",
        lesson:
          "Signing bonuses are good deals if you plan to stay. The clawback is only a trap if you ignore it.",
        net_worth_change: 8000,
      },
      {
        label: "Smart",
        title: "Negotiate no clawback or shorter period",
        impact: "More flexibility. Same bonus if they agree.",
        lesson:
          "Everything in an offer letter is negotiable. The worst they can say is no.",
        net_worth_change: 10000,
      },
      {
        label: "Neutral",
        title: "Decline — you might want to leave before 2 years",
        impact: "No bonus. More flexibility.",
        lesson:
          "If you are unsure about the company, a clawback bonus is a trap you set for yourself.",
        net_worth_change: 0,
      },
    ],
    image_prompt:
      "person reviewing job offer letter at desk with pen in hand looking thoughtful",
    image_url: buildImageUrl(
      "person reviewing job offer letter at desk with pen in hand looking thoughtful",
    ),
    fact_after:
      "42% of professionals who accepted signing bonuses left before the clawback period ended and had to repay. Always read the fine print before signing. — SHRM 2024",
  },
  10: {
    scenario:
      "You're 31. A family member asks to borrow $8,000 and promises to repay in 6 months.",
    question: "Do you lend the $8,000 to your family member?",
    financial_term: "The True Cost of Lending Money to Family",
    definition:
      "Financial advisors say to never lend money you cannot afford to lose. Family loans destroy relationships more often than they save them. If you want to help, consider it a gift — or help in non-cash ways.",
    scenario_type: "life-event",
    choices: [
      {
        label: "Smart",
        title: "Offer $2,000 as a gift, not a loan",
        impact: "Give what you can truly afford to lose.",
        lesson:
          "Give what you can give freely. Loans with expected repayment create resentment when life happens.",
        net_worth_change: -2000,
      },
      {
        label: "Neutral",
        title: "Decline, explain your own financial limits",
        impact: "Preserve your relationship by being honest.",
        lesson:
          "Saying no is not selfish. You cannot help others long-term if you damage your own foundation.",
        net_worth_change: 0,
      },
      {
        label: "Risky",
        title: "Lend the full $8,000 with a handshake deal",
        impact: "60% chance you never see it again. Possible relationship loss.",
        lesson:
          "Money and family are the two things most likely to create permanent rifts. Treat lending as giving.",
        net_worth_change: -5000,
      },
    ],
    image_prompt:
      "two people at kitchen table having serious conversation over coffee about money and family",
    image_url: buildImageUrl(
      "two people at kitchen table having serious conversation over coffee about money and family",
    ),
    fact_after:
      "Only 27% of informal family loans are fully repaid. The average unpaid family loan is $3,600. More than 30% of borrowers report the loan damaged the relationship. — American Bankers Association 2024",
  },
  11: {
    scenario:
      "You're 32. The stock market dropped 25%. Your retirement account lost $18,000.",
    question: "The market crashed. What do you do with your retirement account?",
    financial_term: "Market Volatility and Dollar-Cost Averaging",
    definition:
      "Market crashes are temporary. Every crash in history has recovered. Selling during a crash locks in your losses. Staying invested, or buying more, means you own more shares at a discount when recovery comes.",
    scenario_type: "investment",
    choices: [
      {
        label: "Best",
        title: "Increase contributions — buy the dip",
        impact: "Buy more shares at 25% discount. Bigger upside on recovery.",
        lesson:
          "Market crashes are sales events for long-term investors. Fear is the only thing that should scare you.",
        net_worth_change: 4000,
      },
      {
        label: "Smart",
        title: "Hold steady — don't touch anything",
        impact: "Stay the course. Recover fully when market rebounds.",
        lesson:
          "Time in the market beats timing the market. Every single time.",
        net_worth_change: 0,
      },
      {
        label: "Danger",
        title: "Move everything to cash until it stabilizes",
        impact: "Lock in $18,000 loss. Miss the recovery rally.",
        lesson:
          "Selling after a crash is how ordinary investors destroy their retirement. Do not do this.",
        net_worth_change: -8000,
      },
    ],
    image_prompt:
      "person staring at phone showing red stock chart looking worried and frozen in apartment",
    image_url: buildImageUrl(
      "person staring at phone showing red stock chart looking worried and frozen in apartment",
    ),
    fact_after:
      "Investors who sold during the 2020 COVID crash missed a 100% recovery in 12 months. Those who held or bought more doubled their money. Panic-selling is the most expensive mistake in investing. — Fidelity 2024",
  },
  12: {
    scenario:
      "You're 33. You've reached the end of this chapter. Your decisions have defined your financial foundation.",
    question: "Looking back, which habit do you commit to going forward?",
    financial_term: "Compound Interest — The Eighth Wonder of the World",
    definition:
      "Albert Einstein called compound interest the eighth wonder of the world. Money invested at 25 grows 14x by retirement. The same money invested at 35 grows 7x. The decade you start matters more than the amount.",
    scenario_type: "savings",
    choices: [
      {
        label: "Best",
        title: "Automate 20% savings every paycheck, no exceptions",
        impact: "At 7% return, $800/month becomes $2.1M by age 65.",
        lesson:
          "Automation removes willpower from the equation. You cannot spend what you never see.",
        net_worth_change: 5000,
      },
      {
        label: "Smart",
        title: "Max out Roth IRA every year ($7,000)",
        impact: "Tax-free growth for 30+ years. $7,000/year becomes $700,000.",
        lesson:
          "A Roth IRA grows tax-free forever. Max it every year you can.",
        net_worth_change: 3500,
      },
      {
        label: "Neutral",
        title: "Save what's left after expenses each month",
        impact: "Inconsistent. Average $200/month. Leaves $1.3M on the table.",
        lesson:
          "Pay yourself first. Savings left to chance is savings left to zero.",
        net_worth_change: 1000,
      },
    ],
    image_prompt:
      "person at desk with journal writing financial goals looking determined and hopeful at sunrise",
    image_url: buildImageUrl(
      "person at desk with journal writing financial goals looking determined and hopeful at sunrise",
    ),
    fact_after:
      "Someone who invests $500/month starting at 25 will have $1.3M at 65. Someone who starts at 35 will have $567,000 — less than half — despite only missing 10 years. — Vanguard 2024",
  },
};
