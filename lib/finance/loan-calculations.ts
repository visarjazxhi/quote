/**
 * Loan Calculation Functions
 * Core mathematical functions for loan calculations
 */

import {
  AmortizationEntry,
  LoanAffordabilityInputs,
  LoanAffordabilityResult,
  LoanInputs,
  LoanResult,
  LoanSummary,
  PAYMENT_FREQUENCY_OPTIONS,
  PaymentFrequency,
  PaymentStructure,
} from "./types/loan";

/**
 * Get the number of payments per year for a given frequency
 */
export function getPaymentsPerYear(frequency: PaymentFrequency): number {
  const option = PAYMENT_FREQUENCY_OPTIONS.find(
    (opt) => opt.value === frequency
  );
  return option?.paymentsPerYear ?? 12;
}

/**
 * Calculate monthly payment using the standard loan payment formula
 * PMT = P * [r(1 + r)^n] / [(1 + r)^n - 1]
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  totalPayments: number
): number {
  if (annualRate === 0) {
    return principal / totalPayments;
  }

  const monthlyRate = annualRate / 100 / 12;
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, totalPayments);
  const denominator = Math.pow(1 + monthlyRate, totalPayments) - 1;

  return principal * (numerator / denominator);
}

/**
 * Calculate payment based on frequency and payment structure
 */
export function calculatePaymentAmount(
  principal: number,
  annualRate: number,
  loanTermYears: number,
  loanTermMonths: number,
  paymentFrequency: PaymentFrequency,
  paymentStructure: PaymentStructure = "standard",
  options: {
    balloonAmount?: number;
    interestOnlyPeriodMonths?: number;
    graduationPeriodYears?: number;
    paymentIncreaseRate?: number;
  } = {}
): number {
  const totalMonths = loanTermYears * 12 + loanTermMonths;
  const paymentsPerYear = getPaymentsPerYear(paymentFrequency);
  const totalPayments = (totalMonths / 12) * paymentsPerYear;

  // Handle different payment structures
  switch (paymentStructure) {
    case "interest_only": {
      if (options.interestOnlyPeriodMonths) {
        // During interest-only period, only pay interest
        const monthlyRate = annualRate / 100 / 12;
        return principal * monthlyRate;
      }
      // After interest-only period, calculate remaining payment
      const remainingMonths =
        totalMonths - (options.interestOnlyPeriodMonths || 0);
      return calculateMonthlyPayment(principal, annualRate, remainingMonths);
    }

    case "principal_only":
      // Only principal, no interest
      return principal / totalPayments;

    case "balloon": {
      if (options.balloonAmount) {
        // Calculate payment for principal minus balloon amount
        const financedAmount = principal - options.balloonAmount;
        if (paymentFrequency === "monthly") {
          return calculateMonthlyPayment(
            financedAmount,
            annualRate,
            totalPayments
          );
        }
        const monthlyPayment = calculateMonthlyPayment(
          financedAmount,
          annualRate,
          totalMonths
        );
        return (monthlyPayment * 12) / paymentsPerYear;
      }
      break;
    }

    case "graduated": {
      // Start with lower payment, will be adjusted in amortization schedule
      const standardPayment = calculateMonthlyPayment(
        principal,
        annualRate,
        totalPayments
      );
      return standardPayment * 0.7; // Start at 70% of standard payment
    }

    case "interest_first": {
      // Calculate total interest first
      const standardMonthlyPayment = calculateMonthlyPayment(
        principal,
        annualRate,
        totalPayments
      );
      const totalInterest = standardMonthlyPayment * totalPayments - principal;
      return totalInterest / (totalPayments / 2); // Pay all interest in first half
    }

    case "standard":
    default: {
      if (paymentFrequency === "monthly") {
        return calculateMonthlyPayment(principal, annualRate, totalPayments);
      }
      // For non-monthly frequencies, calculate monthly payment first then convert
      const monthlyPayment = calculateMonthlyPayment(
        principal,
        annualRate,
        totalMonths
      );
      return (monthlyPayment * 12) / paymentsPerYear;
    }
  }

  // Default fallback
  return calculateMonthlyPayment(principal, annualRate, totalPayments);
}

/**
 * Add payments based on frequency
 */
function addPaymentPeriod(date: Date, frequency: PaymentFrequency): Date {
  const result = new Date(date);

  switch (frequency) {
    case "weekly":
      result.setDate(result.getDate() + 7);
      break;
    case "biweekly":
      result.setDate(result.getDate() + 14);
      break;
    case "monthly":
      result.setMonth(result.getMonth() + 1);
      break;
    case "quarterly":
      result.setMonth(result.getMonth() + 3);
      break;
    case "annually":
      result.setFullYear(result.getFullYear() + 1);
      break;
  }

  return result;
}

interface PaymentCalculationOptions {
  balloonAmount?: number;
  interestOnlyPeriodMonths?: number;
  graduationPeriodYears?: number;
  paymentIncreaseRate?: number;
}

/**
 * Calculate payment amounts for a specific payment in the schedule
 */
function calculatePaymentAmounts(
  paymentStructure: PaymentStructure,
  paymentNumber: number,
  remainingBalance: number,
  periodRate: number,
  regularPayment: number,
  totalPayments: number,
  paymentsPerYear: number,
  options: PaymentCalculationOptions
): {
  currentPayment: number;
  interestPayment: number;
  principalPayment: number;
} {
  let currentPayment = regularPayment;
  let interestPayment = 0;
  let principalPayment = 0;

  // Calculate interest for this period
  const periodInterest = remainingBalance * periodRate;

  // Handle different payment structures
  switch (paymentStructure) {
    case "interest_only": {
      if (
        options.interestOnlyPeriodMonths &&
        paymentNumber <= options.interestOnlyPeriodMonths
      ) {
        // During interest-only period
        interestPayment = periodInterest;
        principalPayment = 0;
        currentPayment = interestPayment;
      } else {
        // After interest-only period, standard amortization
        interestPayment = periodInterest;
        principalPayment = currentPayment - interestPayment;
      }
      break;
    }

    case "principal_only":
      // No interest charged
      interestPayment = 0;
      principalPayment = currentPayment;
      break;

    case "balloon": {
      if (paymentNumber === totalPayments && options.balloonAmount) {
        // Final payment includes balloon
        interestPayment = periodInterest;
        principalPayment = remainingBalance - interestPayment;
        currentPayment = principalPayment + interestPayment;
      } else {
        // Regular payments
        interestPayment = periodInterest;
        principalPayment = currentPayment - interestPayment;
      }
      break;
    }

    case "graduated": {
      if (options.graduationPeriodYears && options.paymentIncreaseRate) {
        const graduationPayments =
          options.graduationPeriodYears * paymentsPerYear;
        const graduationFactor = Math.floor(
          (paymentNumber - 1) / graduationPayments
        );
        currentPayment =
          regularPayment *
          Math.pow(1 + options.paymentIncreaseRate / 100, graduationFactor);
      }
      interestPayment = periodInterest;
      principalPayment = currentPayment - interestPayment;
      break;
    }

    case "interest_first": {
      const halfPayments = totalPayments / 2;
      if (paymentNumber <= halfPayments) {
        // First half: pay only interest
        interestPayment = currentPayment;
        principalPayment = 0;
      } else {
        // Second half: pay only principal
        interestPayment = 0;
        principalPayment = currentPayment;
      }
      break;
    }

    case "standard":
    default:
      interestPayment = periodInterest;
      principalPayment = currentPayment - interestPayment;
      break;
  }

  return { currentPayment, interestPayment, principalPayment };
}

/**
 * Generate complete amortization schedule
 */
export function generateAmortizationSchedule(
  inputs: LoanInputs
): AmortizationEntry[] {
  const {
    loanAmount,
    annualRate,
    loanTermYears,
    loanTermMonths,
    paymentFrequency,
    extraPayment,
    startDate,
    paymentStructure = "standard",
    balloonAmount,
    interestOnlyPeriodMonths,
    graduationPeriodYears,
    paymentIncreaseRate,
  } = inputs;

  const schedule: AmortizationEntry[] = [];
  const totalMonths = loanTermYears * 12 + loanTermMonths;
  const paymentsPerYear = getPaymentsPerYear(paymentFrequency);
  const totalPayments = (totalMonths / 12) * paymentsPerYear;

  const regularPayment = calculatePaymentAmount(
    loanAmount,
    annualRate,
    loanTermYears,
    loanTermMonths,
    paymentFrequency,
    paymentStructure,
    {
      balloonAmount,
      interestOnlyPeriodMonths,
      graduationPeriodYears,
      paymentIncreaseRate,
    }
  );

  let remainingBalance = loanAmount;
  let paymentNumber = 1;
  let currentDate = new Date(startDate);

  // Calculate period interest rate
  const annualInterestRate = annualRate / 100;
  const periodRate = annualInterestRate / paymentsPerYear;

  while (remainingBalance > 0.01 && paymentNumber <= totalPayments * 2) {
    // Calculate payment amounts using extracted function
    const { interestPayment, principalPayment: calculatedPrincipalPayment } =
      calculatePaymentAmounts(
        paymentStructure,
        paymentNumber,
        remainingBalance,
        periodRate,
        regularPayment,
        totalPayments,
        paymentsPerYear,
        {
          balloonAmount,
          interestOnlyPeriodMonths,
          graduationPeriodYears,
          paymentIncreaseRate,
        }
      );

    let principalPayment = calculatedPrincipalPayment;

    // Apply extra payment to principal
    let currentExtraPayment = extraPayment;

    // Don't pay more than the remaining balance
    if (principalPayment + currentExtraPayment > remainingBalance) {
      currentExtraPayment = Math.max(0, remainingBalance - principalPayment);
      principalPayment = remainingBalance - currentExtraPayment;
    }

    const totalPaymentAmount =
      principalPayment + interestPayment + currentExtraPayment;

    // Update remaining balance
    remainingBalance -= principalPayment + currentExtraPayment;

    // Add entry to schedule
    schedule.push({
      paymentNumber,
      paymentDate: currentDate.toISOString().split("T")[0],
      paymentAmount: totalPaymentAmount,
      principalPayment,
      interestPayment,
      extraPayment: currentExtraPayment,
      remainingBalance: Math.max(0, remainingBalance),
    });

    // Move to next payment date
    currentDate = addPaymentPeriod(currentDate, paymentFrequency);
    paymentNumber++;
  }

  return schedule;
}

/**
 * Calculate loan summary without extra payments for comparison
 */
function calculateBaselineLoan(inputs: LoanInputs): {
  totalPayments: number;
  totalInterest: number;
  payoffDate: string;
} {
  const baselineInputs = { ...inputs, extraPayment: 0 };
  const baselineSchedule = generateAmortizationSchedule(baselineInputs);

  const totalPayments = baselineSchedule.reduce(
    (sum, entry) => sum + entry.paymentAmount,
    0
  );
  const totalInterest = baselineSchedule.reduce(
    (sum, entry) => sum + entry.interestPayment,
    0
  );
  const payoffDate =
    baselineSchedule[baselineSchedule.length - 1]?.paymentDate ?? "";

  return { totalPayments, totalInterest, payoffDate };
}

/**
 * Calculate complete loan analysis
 */
export function calculateLoan(inputs: LoanInputs): LoanResult {
  const amortizationSchedule = generateAmortizationSchedule(inputs);

  if (amortizationSchedule.length === 0) {
    throw new Error("Unable to generate amortization schedule");
  }

  const monthlyPayment = calculatePaymentAmount(
    inputs.loanAmount,
    inputs.annualRate,
    inputs.loanTermYears,
    inputs.loanTermMonths,
    inputs.paymentFrequency,
    inputs.paymentStructure,
    {
      balloonAmount: inputs.balloonAmount,
      interestOnlyPeriodMonths: inputs.interestOnlyPeriodMonths,
      graduationPeriodYears: inputs.graduationPeriodYears,
      paymentIncreaseRate: inputs.paymentIncreaseRate,
    }
  );

  const totalPayments = amortizationSchedule.reduce(
    (sum, entry) => sum + entry.paymentAmount,
    0
  );

  const totalInterest = amortizationSchedule.reduce(
    (sum, entry) => sum + entry.interestPayment,
    0
  );

  const totalExtraPayments = amortizationSchedule.reduce(
    (sum, entry) => sum + entry.extraPayment,
    0
  );

  const payoffDate =
    amortizationSchedule[amortizationSchedule.length - 1].paymentDate;

  // Calculate savings compared to baseline (no extra payments)
  const baseline = calculateBaselineLoan(inputs);
  const interestSaved = baseline.totalInterest - totalInterest;
  const baselinePayoffDate = new Date(baseline.payoffDate);
  const actualPayoffDate = new Date(payoffDate);
  const timeSavedMonths = Math.round(
    (baselinePayoffDate.getTime() - actualPayoffDate.getTime()) /
      (1000 * 60 * 60 * 24 * 30.44)
  );
  const timeSaved =
    timeSavedMonths > 0
      ? `${Math.floor(timeSavedMonths / 12)} years, ${
          timeSavedMonths % 12
        } months`
      : "0 months";

  const loanSummary: LoanSummary = {
    originalLoanAmount: inputs.loanAmount,
    monthlyPayment,
    totalPayments,
    totalInterest,
    totalExtraPayments,
    interestSaved,
    timeSaved,
    payoffDate,
  };

  return {
    monthlyPayment,
    totalPayments,
    totalInterest,
    totalAmount: totalPayments,
    payoffDate,
    amortizationSchedule,
    loanSummary,
  };
}

/**
 * Calculate loan affordability based on income and debt
 */
export function calculateLoanAffordability(
  inputs: LoanAffordabilityInputs
): LoanAffordabilityResult {
  const {
    monthlyIncome,
    monthlyDebts,
    downPayment,
    annualRate,
    loanTermYears,
    propertyTax,
    insurance,
    pmi,
    hoaFees,
    debtToIncomeRatio,
  } = inputs;

  // Calculate maximum monthly payment based on debt-to-income ratio
  const maxTotalMonthlyPayments = monthlyIncome * (debtToIncomeRatio / 100);
  const maxHousingPayment = maxTotalMonthlyPayments - monthlyDebts;

  // Subtract non-loan housing expenses
  const maxLoanPayment =
    maxHousingPayment - propertyTax - insurance - pmi - hoaFees;

  if (maxLoanPayment <= 0) {
    return {
      maxLoanAmount: 0,
      maxHomePrice: downPayment,
      monthlyPayment: 0,
      totalMonthlyExpenses:
        monthlyDebts + propertyTax + insurance + pmi + hoaFees,
      remainingIncome: monthlyIncome - maxTotalMonthlyPayments,
      debtToIncomeRatio: (monthlyDebts / monthlyIncome) * 100,
      frontEndRatio: 0,
      backEndRatio: (monthlyDebts / monthlyIncome) * 100,
    };
  }

  // Calculate maximum loan amount based on payment capacity
  const totalMonths = loanTermYears * 12;
  const monthlyRate = annualRate / 100 / 12;

  let maxLoanAmount: number;
  if (monthlyRate === 0) {
    maxLoanAmount = maxLoanPayment * totalMonths;
  } else {
    const denominator = monthlyRate * Math.pow(1 + monthlyRate, totalMonths);
    const numerator = Math.pow(1 + monthlyRate, totalMonths) - 1;
    maxLoanAmount = maxLoanPayment * (numerator / denominator);
  }

  const maxHomePrice = maxLoanAmount + downPayment;
  const totalMonthlyExpenses =
    monthlyDebts + maxLoanPayment + propertyTax + insurance + pmi + hoaFees;
  const remainingIncome = monthlyIncome - totalMonthlyExpenses;

  // Calculate ratios
  const frontEndRatio =
    ((maxLoanPayment + propertyTax + insurance + pmi + hoaFees) /
      monthlyIncome) *
    100;
  const backEndRatio = (totalMonthlyExpenses / monthlyIncome) * 100;
  const currentDebtToIncomeRatio = (monthlyDebts / monthlyIncome) * 100;

  return {
    maxLoanAmount,
    maxHomePrice,
    monthlyPayment: maxLoanPayment,
    totalMonthlyExpenses,
    remainingIncome,
    debtToIncomeRatio: currentDebtToIncomeRatio,
    frontEndRatio,
    backEndRatio,
  };
}

/**
 * Calculate refinance savings
 */
export function calculateRefinanceSavings(
  currentLoanBalance: number,
  currentRate: number,
  currentRemainingTermMonths: number,
  newRate: number,
  newTermMonths: number,
  closingCosts: number
): {
  currentPayment: number;
  newPayment: number;
  monthlySavings: number;
  totalSavings: number;
  breakEvenMonths: number;
  totalInterestSavings: number;
} {
  // Calculate current payment
  const currentPayment = calculateMonthlyPayment(
    currentLoanBalance,
    currentRate,
    currentRemainingTermMonths
  );

  // Calculate new payment
  const newPayment = calculateMonthlyPayment(
    currentLoanBalance,
    newRate,
    newTermMonths
  );

  const monthlySavings = currentPayment - newPayment;
  const totalSavings = monthlySavings * newTermMonths - closingCosts;
  const breakEvenMonths =
    monthlySavings > 0 ? closingCosts / monthlySavings : Infinity;

  // Calculate total interest for both loans
  const currentTotalInterest =
    currentPayment * currentRemainingTermMonths - currentLoanBalance;
  const newTotalInterest =
    newPayment * newTermMonths - currentLoanBalance + closingCosts;
  const totalInterestSavings = currentTotalInterest - newTotalInterest;

  return {
    currentPayment,
    newPayment,
    monthlySavings,
    totalSavings,
    breakEvenMonths,
    totalInterestSavings,
  };
}

/**
 * Compare multiple loan scenarios
 */
export function compareLoanScenarios(scenarios: LoanInputs[]): LoanResult[] {
  return scenarios.map((scenario) => calculateLoan(scenario));
}
