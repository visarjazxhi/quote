/**
 * Compound Interest Calculator Types
 * Defines all interfaces and types for compound interest calculations
 */

export interface CompoundInterestInputs {
  principal: number;
  annualRate: number;
  compoundingFrequency: CompoundingFrequency;
  timeInYears: number;
  additionalContributions: number;
  contributionFrequency: ContributionFrequency;
  contributionTiming: ContributionTiming;
}

export interface CompoundInterestResult {
  principal: number;
  totalContributions: number;
  totalInterestEarned: number;
  finalAmount: number;
  effectiveAnnualRate: number;
  yearlyBreakdown: YearlyBreakdown[];
}

export interface YearlyBreakdown {
  year: number;
  startingBalance: number;
  contributions: number;
  interestEarned: number;
  endingBalance: number;
}

export type CompoundingFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "semiannually"
  | "annually";

export type ContributionFrequency =
  | "none"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "annually";

export type ContributionTiming = "beginning" | "end";

export interface CompoundingOption {
  value: CompoundingFrequency;
  label: string;
  periodsPerYear: number;
}

export interface ContributionOption {
  value: ContributionFrequency;
  label: string;
  periodsPerYear: number;
}

export const COMPOUNDING_OPTIONS: CompoundingOption[] = [
  { value: "daily", label: "Daily", periodsPerYear: 365 },
  { value: "weekly", label: "Weekly", periodsPerYear: 52 },
  { value: "monthly", label: "Monthly", periodsPerYear: 12 },
  { value: "quarterly", label: "Quarterly", periodsPerYear: 4 },
  { value: "semiannually", label: "Semiannually", periodsPerYear: 2 },
  { value: "annually", label: "Annually", periodsPerYear: 1 },
];

export const CONTRIBUTION_OPTIONS: ContributionOption[] = [
  { value: "none", label: "No Additional Contributions", periodsPerYear: 0 },
  { value: "weekly", label: "Weekly", periodsPerYear: 52 },
  { value: "monthly", label: "Monthly", periodsPerYear: 12 },
  { value: "quarterly", label: "Quarterly", periodsPerYear: 4 },
  { value: "annually", label: "Annually", periodsPerYear: 1 },
];

export const CONTRIBUTION_TIMING_OPTIONS = [
  { value: "beginning" as ContributionTiming, label: "Beginning of Period" },
  { value: "end" as ContributionTiming, label: "End of Period" },
];

export interface CompoundInterestFormData {
  principal: string;
  annualRate: string;
  compoundingFrequency: CompoundingFrequency;
  timeInYears: string;
  additionalContributions: string;
  contributionFrequency: ContributionFrequency;
  contributionTiming: ContributionTiming;
}

export interface CompoundInterestScenario {
  name: string;
  principal: number;
  annualRate: number;
  timeInYears: number;
  result?: CompoundInterestResult;
}
