import {
  compoundGrowth,
  fullMatchContribution,
  monthlyPayment,
  projectRetirement,
  totalInterest,
} from "@/lib/financial-math";

describe("financial-math", () => {
  it("calculates compound growth", () => {
    expect(compoundGrowth(1000, 0.1, 2)).toBe(1210);
  });

  it("calculates monthly payment and total interest for a loan", () => {
    expect(monthlyPayment(100000, 0.05, 30)).toBe(537);
    expect(totalInterest(100000, 0.05, 30)).toBe(93320);
  });

  it("projects retirement balance with monthly contributions", () => {
    expect(projectRetirement(25, 10000, 300, 0.07)).toBe(937189);
  });

  it("calculates full employer match contribution", () => {
    expect(fullMatchContribution(90000)).toBe(4500);
    expect(fullMatchContribution(90000, 0.03)).toBe(2700);
  });
});
