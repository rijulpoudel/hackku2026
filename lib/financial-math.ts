export function compoundGrowth(
  principal: number,
  annualRate: number,
  years: number,
): number {
  return Math.round(principal * Math.pow(1 + annualRate, years));
}

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

export function totalInterest(
  principal: number,
  annualRate: number,
  years: number,
): number {
  const payment = monthlyPayment(principal, annualRate, years);
  return Math.round(payment * years * 12 - principal);
}

export function projectRetirement(
  currentAge: number,
  current401k: number,
  monthlyContribution: number,
  annualReturn = 0.07,
): number {
  const yearsToRetirement = 65 - currentAge;
  const monthlyRate = annualReturn / 12;
  const months = yearsToRetirement * 12;

  const existingGrowth =
    current401k * Math.pow(1 + annualReturn, yearsToRetirement);

  const contributionGrowth =
    monthlyContribution *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  return Math.round(existingGrowth + contributionGrowth);
}

export function fullMatchContribution(
  salary: number,
  matchPercent = 0.05,
): number {
  return Math.round(salary * matchPercent);
}
