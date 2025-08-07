/**
 * Compound Interest Calculation Functions
 * Core mathematical functions for compound interest calculations
 */

import {
  COMPOUNDING_OPTIONS,
  CONTRIBUTION_OPTIONS,
  CompoundInterestInputs,
  CompoundInterestResult,
  CompoundingFrequency,
  ContributionFrequency,
  YearlyBreakdown,
} from "./types/compound-interest";

/**
 * Get the number of compounding periods per year
 */
export function getCompoundingPeriodsPerYear(
  frequency: CompoundingFrequency
): number {
  const option = COMPOUNDING_OPTIONS.find((opt) => opt.value === frequency);
  return option?.periodsPerYear ?? 12;
}

/**
 * Get the number of contribution periods per year
 */
export function getContributionPeriodsPerYear(
  frequency: ContributionFrequency
): number {
  const option = CONTRIBUTION_OPTIONS.find((opt) => opt.value === frequency);
  return option?.periodsPerYear ?? 0;
}

/**
 * Calculate compound interest with regular contributions
 * Uses the compound interest formula: A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
 */
export function calculateCompoundInterest(
  inputs: CompoundInterestInputs
): CompoundInterestResult {
  const {
    principal,
    annualRate,
    compoundingFrequency,
    timeInYears,
    additionalContributions,
    contributionFrequency,
    contributionTiming,
  } = inputs;

  const n = getCompoundingPeriodsPerYear(compoundingFrequency);
  const contributionPeriods = getContributionPeriodsPerYear(
    contributionFrequency
  );
  const r = annualRate / 100;
  const rPerN = r / n;
  const totalPeriods = n * timeInYears;

  // Calculate compound interest on principal
  const principalGrowth = principal * Math.pow(1 + rPerN, totalPeriods);

  let contributionsGrowth = 0;
  let totalContributions = 0;

  // Calculate growth from regular contributions
  if (contributionPeriods > 0 && additionalContributions > 0) {
    totalContributions =
      additionalContributions * contributionPeriods * timeInYears;

    // Convert contribution frequency to compounding frequency
    const contributionPerCompoundingPeriod =
      (additionalContributions * contributionPeriods) / n;

    if (rPerN === 0) {
      // No interest case
      contributionsGrowth = totalContributions;
    } else {
      // Future value of annuity formula
      const annuityFactor = (Math.pow(1 + rPerN, totalPeriods) - 1) / rPerN;
      contributionsGrowth = contributionPerCompoundingPeriod * annuityFactor;

      // Adjust for beginning of period contributions
      if (contributionTiming === "beginning") {
        contributionsGrowth *= 1 + rPerN;
      }
    }
  }

  const finalAmount = principalGrowth + contributionsGrowth;
  const totalInterestEarned = finalAmount - principal - totalContributions;

  // Calculate effective annual rate
  const effectiveAnnualRate = r === 0 ? 0 : (Math.pow(1 + rPerN, n) - 1) * 100;

  // Generate yearly breakdown
  const yearlyBreakdown = generateYearlyBreakdown(inputs);

  return {
    principal,
    totalContributions,
    totalInterestEarned,
    finalAmount,
    effectiveAnnualRate,
    yearlyBreakdown,
  };
}

/**
 * Generate year-by-year breakdown of compound interest growth
 */
export function generateYearlyBreakdown(
  inputs: CompoundInterestInputs
): YearlyBreakdown[] {
  const {
    principal,
    annualRate,
    compoundingFrequency,
    timeInYears,
    additionalContributions,
    contributionFrequency,
    contributionTiming,
  } = inputs;

  const breakdown: YearlyBreakdown[] = [];
  const n = getCompoundingPeriodsPerYear(compoundingFrequency);
  const contributionPeriods = getContributionPeriodsPerYear(
    contributionFrequency
  );
  const r = annualRate / 100;
  const rPerN = r / n;

  let currentBalance = principal;
  const contributionPerPeriod =
    contributionPeriods > 0
      ? (additionalContributions * contributionPeriods) / n
      : 0;

  for (let year = 1; year <= timeInYears; year++) {
    const startingBalance = currentBalance;
    let yearContributions = 0;
    let yearInterest = 0;

    // Calculate growth for each compounding period in the year
    for (let period = 1; period <= n; period++) {
      // Add contribution at beginning of period if applicable
      if (contributionTiming === "beginning" && contributionPerPeriod > 0) {
        currentBalance += contributionPerPeriod;
        yearContributions += contributionPerPeriod;
      }

      // Calculate interest for this period
      const periodInterest = currentBalance * rPerN;
      currentBalance += periodInterest;
      yearInterest += periodInterest;

      // Add contribution at end of period if applicable
      if (contributionTiming === "end" && contributionPerPeriod > 0) {
        currentBalance += contributionPerPeriod;
        yearContributions += contributionPerPeriod;
      }
    }

    breakdown.push({
      year,
      startingBalance,
      contributions: yearContributions,
      interestEarned: yearInterest,
      endingBalance: currentBalance,
    });
  }

  return breakdown;
}

/**
 * Calculate time to target with no contributions (simple case)
 */
function calculateSimpleTimeToTarget(
  principal: number,
  targetAmount: number,
  annualRate: number,
  compoundingFrequency: CompoundingFrequency
): number {
  const n = getCompoundingPeriodsPerYear(compoundingFrequency);
  const r = annualRate / 100;
  const rPerN = r / n;

  if (r === 0) {
    return Infinity; // Cannot reach target with no interest and no contributions
  }
  return Math.log(targetAmount / principal) / (n * Math.log(1 + rPerN));
}

/**
 * Binary search for precise time calculation
 */
function binarySearchTimeToTarget(
  baseInputs: CompoundInterestInputs,
  targetAmount: number,
  lowYears: number,
  highYears: number
): number {
  const tolerance = 0.01;

  for (let i = 0; i < 20; i++) {
    const mid = (lowYears + highYears) / 2;
    const midInputs: CompoundInterestInputs = {
      ...baseInputs,
      timeInYears: mid,
    };
    const midResult = calculateCompoundInterest(midInputs);

    if (Math.abs(midResult.finalAmount - targetAmount) < tolerance) {
      return mid;
    }

    if (midResult.finalAmount < targetAmount) {
      lowYears = mid;
    } else {
      highYears = mid;
    }
  }

  return (lowYears + highYears) / 2;
}

/**
 * Calculate the time needed to reach a target amount
 */
export function calculateTimeToTarget(
  principal: number,
  targetAmount: number,
  annualRate: number,
  compoundingFrequency: CompoundingFrequency,
  additionalContributions: number = 0,
  contributionFrequency: ContributionFrequency = "none"
): number {
  if (targetAmount <= principal) {
    return 0;
  }

  const contributionPeriods = getContributionPeriodsPerYear(
    contributionFrequency
  );

  // Simple case: no contributions
  if (contributionPeriods === 0 || additionalContributions === 0) {
    return calculateSimpleTimeToTarget(
      principal,
      targetAmount,
      annualRate,
      compoundingFrequency
    );
  }

  // Complex case with contributions - use iterative method
  const baseInputs: CompoundInterestInputs = {
    principal,
    annualRate,
    compoundingFrequency,
    timeInYears: 1,
    additionalContributions,
    contributionFrequency,
    contributionTiming: "end",
  };

  let years = 1;
  const maxYears = 100;
  const tolerance = 0.01;

  while (years <= maxYears) {
    const testInputs = { ...baseInputs, timeInYears: years };
    const result = calculateCompoundInterest(testInputs);

    if (Math.abs(result.finalAmount - targetAmount) < tolerance) {
      return years;
    }

    if (result.finalAmount > targetAmount) {
      return binarySearchTimeToTarget(
        baseInputs,
        targetAmount,
        years - 1,
        years
      );
    }

    years += 0.5;
  }

  return maxYears;
}

/**
 * Calculate the required monthly contribution to reach a target
 */
export function calculateRequiredContribution(
  principal: number,
  targetAmount: number,
  annualRate: number,
  timeInYears: number,
  compoundingFrequency: CompoundingFrequency,
  contributionFrequency: ContributionFrequency
): number {
  if (timeInYears <= 0 || targetAmount <= principal) {
    return 0;
  }

  const n = getCompoundingPeriodsPerYear(compoundingFrequency);
  const contributionPeriods = getContributionPeriodsPerYear(
    contributionFrequency
  );

  if (contributionPeriods === 0) {
    return 0; // Cannot contribute with 'none' frequency
  }

  const r = annualRate / 100;
  const rPerN = r / n;
  const totalPeriods = n * timeInYears;

  // Calculate future value of principal
  const principalFV = principal * Math.pow(1 + rPerN, totalPeriods);
  const neededFromContributions = targetAmount - principalFV;

  if (neededFromContributions <= 0) {
    return 0; // Principal alone reaches the target
  }

  // Calculate required periodic contribution
  const contributionPerCompoundingPeriod = contributionPeriods / n; // Contributions per compounding period

  if (rPerN === 0) {
    // No interest case
    return neededFromContributions / (contributionPeriods * timeInYears);
  }

  // Future value of annuity formula: FV = PMT * [((1 + r)^n - 1) / r]
  const annuityFactor = (Math.pow(1 + rPerN, totalPeriods) - 1) / rPerN;
  const requiredPerCompoundingPeriod = neededFromContributions / annuityFactor;

  return requiredPerCompoundingPeriod / contributionPerCompoundingPeriod;
}

/**
 * Compare different compound interest scenarios
 */
export function compareScenarios(
  scenarios: CompoundInterestInputs[]
): CompoundInterestResult[] {
  return scenarios.map((scenario) => calculateCompoundInterest(scenario));
}
