/**
 * Loan Calculator Types
 * Defines all interfaces and types for loan calculations
 */

export interface LoanInputs {
  loanAmount: number;
  annualRate: number;
  loanTermYears: number;
  loanTermMonths: number;
  paymentFrequency: PaymentFrequency;
  extraPayment: number;
  startDate: string;
  paymentStructure: PaymentStructure;
  balloonAmount?: number;
  interestOnlyPeriodMonths?: number;
  graduationPeriodYears?: number;
  paymentIncreaseRate?: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  totalAmount: number;
  payoffDate: string;
  amortizationSchedule: AmortizationEntry[];
  loanSummary: LoanSummary;
}

export interface AmortizationEntry {
  paymentNumber: number;
  paymentDate: string;
  paymentAmount: number;
  principalPayment: number;
  interestPayment: number;
  extraPayment: number;
  remainingBalance: number;
}

export interface LoanSummary {
  originalLoanAmount: number;
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  totalExtraPayments: number;
  interestSaved: number;
  timeSaved: string;
  payoffDate: string;
}

export type PaymentFrequency =
  | "monthly"
  | "biweekly"
  | "weekly"
  | "quarterly"
  | "annually";

export interface PaymentFrequencyOption {
  value: PaymentFrequency;
  label: string;
  paymentsPerYear: number;
}

export const PAYMENT_FREQUENCY_OPTIONS: PaymentFrequencyOption[] = [
  { value: "monthly", label: "Monthly", paymentsPerYear: 12 },
  { value: "biweekly", label: "Bi-weekly", paymentsPerYear: 26 },
  { value: "weekly", label: "Weekly", paymentsPerYear: 52 },
  { value: "quarterly", label: "Quarterly", paymentsPerYear: 4 },
  { value: "annually", label: "Annually", paymentsPerYear: 1 },
];

export interface LoanFormData {
  loanAmount: string;
  annualRate: string;
  loanTermYears: string;
  loanTermMonths: string;
  paymentFrequency: PaymentFrequency;
  extraPayment: string;
  startDate: string;
  paymentStructure: PaymentStructure;
  balloonAmount: string;
  interestOnlyPeriodMonths: string;
  graduationPeriodYears: string;
  paymentIncreaseRate: string;
}

export interface LoanComparison {
  scenario: string;
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  payoffDate: string;
}

export interface LoanAffordabilityInputs {
  monthlyIncome: number;
  monthlyDebts: number;
  downPayment: number;
  annualRate: number;
  loanTermYears: number;
  propertyTax: number;
  insurance: number;
  pmi: number;
  hoaFees: number;
  debtToIncomeRatio: number;
}

export interface LoanAffordabilityResult {
  maxLoanAmount: number;
  maxHomePrice: number;
  monthlyPayment: number;
  totalMonthlyExpenses: number;
  remainingIncome: number;
  debtToIncomeRatio: number;
  frontEndRatio: number;
  backEndRatio: number;
}

export type LoanType =
  | "mortgage"
  | "auto"
  | "personal"
  | "student"
  | "business";

export interface LoanTypeOption {
  value: LoanType;
  label: string;
  description: string;
  typicalRate: number;
  typicalTerm: number;
}

export const LOAN_TYPE_OPTIONS: LoanTypeOption[] = [
  {
    value: "mortgage",
    label: "Mortgage",
    description: "Home loan with long-term repayment",
    typicalRate: 6.5,
    typicalTerm: 30,
  },
  {
    value: "auto",
    label: "Auto Loan",
    description: "Vehicle financing with moderate terms",
    typicalRate: 7.0,
    typicalTerm: 5,
  },
  {
    value: "personal",
    label: "Personal Loan",
    description: "Unsecured loan for various purposes",
    typicalRate: 12.0,
    typicalTerm: 3,
  },
  {
    value: "student",
    label: "Student Loan",
    description: "Education financing with flexible terms",
    typicalRate: 5.5,
    typicalTerm: 10,
  },
  {
    value: "business",
    label: "Business Loan",
    description: "Commercial financing for business needs",
    typicalRate: 8.0,
    typicalTerm: 7,
  },
];

export type PaymentStructure =
  | "standard"
  | "interest_only"
  | "principal_only"
  | "balloon"
  | "graduated"
  | "interest_first";

export interface PaymentStructureOption {
  value: PaymentStructure;
  label: string;
  description: string;
  requiresBalloonAmount?: boolean;
  requiresGraduationPeriod?: boolean;
}

export const PAYMENT_STRUCTURE_OPTIONS: PaymentStructureOption[] = [
  {
    value: "standard",
    label: "Standard (Principal + Interest)",
    description: "Regular monthly payments with principal and interest",
  },
  {
    value: "interest_only",
    label: "Interest Only",
    description:
      "Pay only interest for a specified period, then principal + interest",
    requiresGraduationPeriod: true,
  },
  {
    value: "principal_only",
    label: "Principal Only",
    description: "Pay only principal (0% interest rate scenarios)",
  },
  {
    value: "balloon",
    label: "Balloon Payment",
    description: "Lower payments with large final payment",
    requiresBalloonAmount: true,
  },
  {
    value: "graduated",
    label: "Graduated Payment",
    description: "Payments start low and increase over time",
    requiresGraduationPeriod: true,
  },
  {
    value: "interest_first",
    label: "Interest First, Then Principal",
    description: "Pay all interest first, then all principal",
  },
];
