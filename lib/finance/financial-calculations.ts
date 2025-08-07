/**
 * Financial Calculation Functions
 * Core mathematical functions for Time Value of Money calculations
 */

import {
  COMPOUNDING_OPTIONS,
  CompoundingFrequency,
  TVMInputs,
  TVMResult,
} from "./types/financial";

/**
 * Get the number of compounding periods per year
 */
export function getPeriodsPerYear(frequency: CompoundingFrequency): number {
  const option = COMPOUNDING_OPTIONS.find((opt) => opt.value === frequency);
  return option?.periodsPerYear ?? 12;
}

/**
 * Calculate Present Value (PV)
 * PV = FV / (1 + r/n)^(nt) - PMT * [((1 + r/n)^(nt) - 1) / (r/n)] / (1 + r/n)^(nt)
 */
export function calculatePresentValue(
  inputs: Omit<TVMInputs, "presentValue">
): number {
  const {
    futureValue,
    payment,
    annualRate,
    periods,
    compoundingFrequency,
    paymentTiming,
  } = inputs;

  const n = getPeriodsPerYear(compoundingFrequency);
  const r = annualRate / 100;
  const rPerN = r / n;
  const nt = periods;

  if (rPerN === 0) {
    return futureValue - payment * nt;
  }

  const compoundFactor = Math.pow(1 + rPerN, nt);
  const annuityFactor = (compoundFactor - 1) / rPerN;

  let pv = futureValue / compoundFactor;

  if (payment !== 0) {
    const annuityPV = (payment * annuityFactor) / compoundFactor;
    if (paymentTiming === "beginning") {
      pv -= annuityPV * (1 + rPerN);
    } else {
      pv -= annuityPV;
    }
  }

  return pv;
}

/**
 * Calculate Future Value (FV)
 * FV = PV * (1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
 */
export function calculateFutureValue(
  inputs: Omit<TVMInputs, "futureValue">
): number {
  const {
    presentValue,
    payment,
    annualRate,
    periods,
    compoundingFrequency,
    paymentTiming,
  } = inputs;

  const n = getPeriodsPerYear(compoundingFrequency);
  const r = annualRate / 100;
  const rPerN = r / n;
  const nt = periods;

  if (rPerN === 0) {
    return presentValue + payment * nt;
  }

  const compoundFactor = Math.pow(1 + rPerN, nt);
  const annuityFactor = (compoundFactor - 1) / rPerN;

  let fv = presentValue * compoundFactor;

  if (payment !== 0) {
    const annuityFV = payment * annuityFactor;
    if (paymentTiming === "beginning") {
      fv += annuityFV * (1 + rPerN);
    } else {
      fv += annuityFV;
    }
  }

  return fv;
}

/**
 * Calculate Payment (PMT)
 * PMT = (PV * r/n * (1 + r/n)^nt - FV * r/n) / ((1 + r/n)^nt - 1)
 * For beginning of period, adjust by dividing by (1 + r/n)
 */
export function calculatePayment(inputs: Omit<TVMInputs, "payment">): number {
  const {
    presentValue,
    futureValue,
    annualRate,
    periods,
    compoundingFrequency,
    paymentTiming,
  } = inputs;

  const n = getPeriodsPerYear(compoundingFrequency);
  const r = annualRate / 100;
  const rPerN = r / n;
  const nt = periods;

  if (rPerN === 0) {
    return (futureValue - presentValue) / nt;
  }

  const compoundFactor = Math.pow(1 + rPerN, nt);

  // Standard PMT formula: PMT = (PV * r * (1+r)^n - FV * r) / ((1+r)^n - 1)
  const numerator = presentValue * rPerN * compoundFactor - futureValue * rPerN;
  const denominator = compoundFactor - 1;

  let payment = -numerator / denominator;

  if (paymentTiming === "beginning") {
    payment = payment / (1 + rPerN);
  }

  return payment;
}

/**
 * Calculate Annual Interest Rate
 * Uses iterative method (Newton-Raphson) to solve for rate
 */
export function calculateAnnualRate(
  inputs: Omit<TVMInputs, "annualRate">
): number {
  const { futureValue } = inputs;

  // Initial guess
  let rate = 0.1;
  const tolerance = 0.0001;
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    const testInputs = {
      presentValue: inputs.presentValue,
      futureValue: inputs.futureValue,
      payment: inputs.payment,
      periods: inputs.periods,
      compoundingFrequency: inputs.compoundingFrequency,
      paymentTiming: inputs.paymentTiming,
      annualRate: rate * 100,
    };

    const calculatedFV = calculateFutureValue(testInputs);
    const error = calculatedFV - futureValue;

    if (Math.abs(error) < tolerance) {
      return rate * 100;
    }

    // Calculate derivative (small increment method)
    const deltaRate = 0.0001;
    const testInputsPlus = {
      presentValue: inputs.presentValue,
      futureValue: inputs.futureValue,
      payment: inputs.payment,
      periods: inputs.periods,
      compoundingFrequency: inputs.compoundingFrequency,
      paymentTiming: inputs.paymentTiming,
      annualRate: (rate + deltaRate) * 100,
    };
    const fvPlus = calculateFutureValue(testInputsPlus);
    const derivative = (fvPlus - calculatedFV) / deltaRate;

    if (Math.abs(derivative) < tolerance) {
      break;
    }

    // Newton-Raphson update
    rate = rate - error / derivative;

    // Keep rate within reasonable bounds
    rate = Math.max(-0.99, Math.min(rate, 10));
  }

  return rate * 100;
}

/**
 * Calculate Number of Periods
 * n = ln(FV/PV) / ln(1 + r/n) for lump sum
 * More complex for annuities - uses iterative method
 */
export function calculatePeriods(inputs: Omit<TVMInputs, "periods">): number {
  const {
    presentValue,
    futureValue,
    payment,
    annualRate,
    compoundingFrequency,
    paymentTiming,
  } = inputs;

  const n = getPeriodsPerYear(compoundingFrequency);
  const r = annualRate / 100;
  const rPerN = r / n;

  // Simple case: no payments (lump sum only)
  if (payment === 0) {
    if (rPerN === 0) {
      return (futureValue - presentValue) / presentValue;
    }
    return Math.log(futureValue / presentValue) / Math.log(1 + rPerN);
  }

  // Complex case with payments - use iterative method
  let periods = 1;
  const tolerance = 0.01;
  const maxIterations = 1000;

  for (let i = 0; i < maxIterations; i++) {
    const testInputs = {
      presentValue,
      futureValue,
      payment,
      annualRate,
      compoundingFrequency,
      paymentTiming,
      periods: periods,
    };

    const calculatedFV = calculateFutureValue(testInputs);
    const error = Math.abs(calculatedFV - futureValue);

    if (error < tolerance) {
      return periods;
    }

    // Adjust periods based on error direction
    if (calculatedFV < futureValue) {
      periods += 0.1;
    } else {
      periods -= 0.1;
    }

    // Keep within reasonable bounds
    periods = Math.max(0.1, Math.min(periods, 1000));
  }

  return periods;
}

/**
 * Perform TVM calculation based on the mode
 */
export function calculateTVM(
  inputs: TVMInputs,
  mode: keyof TVMInputs
): TVMResult {
  let result: TVMResult;

  switch (mode) {
    case "presentValue":
      const pv = calculatePresentValue(inputs);
      result = {
        ...inputs,
        presentValue: pv,
        totalInterest: 0,
        totalPayments: inputs.payment * inputs.periods,
      };
      break;

    case "futureValue":
      const fv = calculateFutureValue(inputs);
      result = {
        ...inputs,
        futureValue: fv,
        totalInterest:
          fv - inputs.presentValue - inputs.payment * inputs.periods,
        totalPayments: inputs.payment * inputs.periods,
      };
      break;

    case "payment":
      const pmt = calculatePayment(inputs);
      result = {
        ...inputs,
        payment: pmt,
        totalInterest:
          inputs.futureValue - inputs.presentValue - pmt * inputs.periods,
        totalPayments: pmt * inputs.periods,
      };
      break;

    case "annualRate":
      const rate = calculateAnnualRate(inputs);
      result = {
        ...inputs,
        annualRate: rate,
        totalInterest:
          inputs.futureValue -
          inputs.presentValue -
          inputs.payment * inputs.periods,
        totalPayments: inputs.payment * inputs.periods,
      };
      break;

    case "periods":
      const periods = calculatePeriods(inputs);
      result = {
        ...inputs,
        periods: periods,
        totalInterest:
          inputs.futureValue - inputs.presentValue - inputs.payment * periods,
        totalPayments: inputs.payment * periods,
      };
      break;

    default:
      throw new Error(`Invalid calculation mode: ${mode}`);
  }

  return result;
}
