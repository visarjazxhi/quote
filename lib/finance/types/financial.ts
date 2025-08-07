/**
 * Time Value of Money Calculator Types
 * Defines all interfaces and types for financial calculations
 */

export interface TVMInputs {
  presentValue: number;
  futureValue: number;
  payment: number;
  annualRate: number;
  periods: number;
  compoundingFrequency: CompoundingFrequency;
  paymentTiming: PaymentTiming;
}

export interface TVMResult {
  presentValue: number;
  futureValue: number;
  payment: number;
  annualRate: number;
  periods: number;
  totalInterest: number;
  totalPayments: number;
}

export type CompoundingFrequency =
  | "annually"
  | "semiannually"
  | "quarterly"
  | "monthly"
  | "semimonthly"
  | "biweekly"
  | "weekly"
  | "daily";

export type PaymentTiming = "end" | "beginning";

export type TVMCalculationMode =
  | "presentValue"
  | "futureValue"
  | "payment"
  | "annualRate"
  | "periods";

export interface CompoundingOption {
  value: CompoundingFrequency;
  label: string;
  periodsPerYear: number;
}

export const COMPOUNDING_OPTIONS: CompoundingOption[] = [
  { value: "annually", label: "Annually", periodsPerYear: 1 },
  { value: "semiannually", label: "Semiannually", periodsPerYear: 2 },
  { value: "quarterly", label: "Quarterly", periodsPerYear: 4 },
  { value: "monthly", label: "Monthly", periodsPerYear: 12 },
  { value: "semimonthly", label: "Semimonthly", periodsPerYear: 24 },
  { value: "biweekly", label: "Bi-Weekly", periodsPerYear: 26 },
  { value: "weekly", label: "Weekly", periodsPerYear: 52 },
  { value: "daily", label: "Daily", periodsPerYear: 365 },
];

export interface TVMFormData {
  mode: TVMCalculationMode;
  presentValue: string;
  futureValue: string;
  payment: string;
  annualRate: string;
  periods: string;
  compoundingFrequency: CompoundingFrequency;
  paymentTiming: PaymentTiming;
}
