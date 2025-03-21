export type Option = {
  text: string
  nextQuestion?: number
  result?: string
}

export type Question = {
  text: string
  options: Option[]
}

export type QuestionsData = {
  [key: number]: Question
}

export const questions: QuestionsData = {
  1: {
    text: "Will you be the only owner of the business?",
    options: [
      { text: "Yes", nextQuestion: 2 },
      { text: "No", nextQuestion: 5 },
    ],
  },
  2: {
    text: "Do you want full control and responsibility, and are you comfortable with unlimited personal liability?",
    options: [
      { text: "Yes", result: "Sole Trader" },
      { text: "No", nextQuestion: 3 },
    ],
  },
  3: {
    text: "Are you expecting to accumulate profits in the business and benefit from a lower company tax rate?",
    options: [
      { text: "Yes", nextQuestion: 4 },
      { text: "No", result: "Discretionary Trust" },
    ],
  },
  4: {
    text: "Will the business require R&D activities, IP ownership, or capital reinvestment?",
    options: [
      { text: "Yes", result: "Company" },
      { text: "No", result: "Discretionary Trust" },
    ],
  },
  5: {
    text: "Are all owners going to be individuals (not entities) with equal say and profit share?",
    options: [
      { text: "Yes", nextQuestion: 6 },
      { text: "No", nextQuestion: 7 },
    ],
  },
  6: {
    text: "Do all partners understand they'll be jointly and severally liable for business debts?",
    options: [
      { text: "Yes", result: "Partnership" },
      { text: "No", nextQuestion: 8 },
    ],
  },
  7: {
    text: "Do you need to direct income to beneficiaries (e.g., family members) for tax purposes?",
    options: [
      { text: "Yes", result: "Discretionary Trust" },
      { text: "No", nextQuestion: 9 },
    ],
  },
  8: {
    text: "Will business profits be retained for growth, and do you prefer a flat tax rate?",
    options: [
      { text: "Yes", result: "Company" },
      { text: "No", result: "Unit Trust" },
    ],
  },
  9: {
    text: "Will the business hold appreciating assets like real estate or IP?",
    options: [
      { text: "Yes", nextQuestion: 10 },
      { text: "No", nextQuestion: 11 },
    ],
  },
  10: {
    text: "Do you want to legally separate those assets from the business operation to protect them?",
    options: [
      { text: "Yes", result: "Discretionary or Unit Trust (based on owners)" },
      { text: "No", result: "Company" },
    ],
  },
  11: {
    text: "Will the business be generating immediate income or likely incur losses initially?",
    options: [
      { text: "Income", nextQuestion: 12 },
      { text: "Losses", nextQuestion: 13 },
    ],
  },
  12: {
    text: "Do you want to pay super contributions from the business structure as deductible expenses?",
    options: [
      { text: "Yes", result: "Company" },
      { text: "No", result: "Partnership or Sole Trader (based on number of owners)" },
    ],
  },
  13: {
    text: "Do you have other income you'd like to offset early losses against?",
    options: [
      { text: "Yes", result: "Sole Trader or Partnership (based on number of owners)" },
      { text: "No", result: "Company" },
    ],
  },
  14: {
    text: "Do you plan to involve employees in equity/shareholding arrangements?",
    options: [
      { text: "Yes", result: "Company" },
      { text: "No", nextQuestion: 15 },
    ],
  },
  15: {
    text: "Is it important that the structure continues if you exit (succession planning)?",
    options: [
      { text: "Yes", nextQuestion: 16 },
      { text: "No", nextQuestion: 17 },
    ],
  },
  16: {
    text: "Are you seeking flexibility in profit distribution over time?",
    options: [
      { text: "Yes", result: "Discretionary Trust" },
      { text: "No", result: "Company" },
    ],
  },
  17: {
    text: "Are setup costs and admin requirements a major concern for you?",
    options: [
      { text: "Yes", result: "Sole Trader or Partnership (based on number of owners)" },
      { text: "No", nextQuestion: 18 },
    ],
  },
  18: {
    text: "Do you plan to raise funds via joint ventures, investors, or franchising?",
    options: [
      { text: "Yes", result: "Company" },
      { text: "No", nextQuestion: 19 },
    ],
  },
  19: {
    text: "Do you want to minimise CGT and access small business CGT concessions in future?",
    options: [
      { text: "Yes", result: "Trust (Discretionary or Unit depending on structure)" },
      { text: "No", nextQuestion: 20 },
    ],
  },
  20: {
    text: "Is your focus purely on operational simplicity over long-term flexibility or protection?",
    options: [
      { text: "Yes", result: "Sole Trader or Partnership (based on prior answers)" },
      { text: "No", result: "Company" },
    ],
  },
}

