export type StructureExplanation = {
  title: string
  description: string
  keyFeatures: string[]
  advantages: string[]
  disadvantages: string[]
  taxConsiderations: string
  suitableFor: string[]
  setupRequirements: string[]
}

export const structureExplanations: Record<string, StructureExplanation> = {
  "Sole Trader": {
    title: "Sole Trader",
    description:
      "A sole trader is the simplest business structure in Australia. As a sole trader, you are the sole owner of the business and are legally responsible for all aspects of it.",
    keyFeatures: [
      "Complete control over business decisions",
      "Simplest and least expensive structure to set up and maintain",
      "Business income is treated as your personal income",
      "Unlimited personal liability for business debts",
    ],
    advantages: [
      "Low setup and ongoing costs",
      "Simple regulatory and tax obligations",
      "Complete control over business operations and decisions",
      "Ability to change structure later as business grows",
      "Privacy - minimal public disclosure requirements",
    ],
    disadvantages: [
      "Unlimited personal liability - personal assets at risk",
      "Limited access to capital for growth",
      "Difficult to sell or transfer the business",
      "Business ceases upon death of owner",
      "Limited tax planning opportunities",
    ],
    taxConsiderations:
      "Business profits are taxed at your personal income tax rate. You can claim deductions for business expenses, and you may be eligible for the small business tax concessions.",
    suitableFor: [
      "New or small businesses with low risk",
      "Service-based businesses with minimal capital requirements",
      "Professionals and consultants",
      "Businesses with a single owner-operator",
      "Those testing a business concept before committing to a more complex structure",
    ],
    setupRequirements: [
      "Apply for an Australian Business Number (ABN)",
      "Register your business name (if different from your personal name)",
      "Register for GST if turnover exceeds $75,000",
      "Set up proper accounting records",
      "Consider business insurance options",
    ],
  },
  Partnership: {
    title: "Partnership",
    description:
      "A partnership is a business structure where two or more people or entities operate a business together, but not as a company. Partners share income, losses, and control of the business.",
    keyFeatures: [
      "Shared control and management between partners",
      "Relatively simple and inexpensive to establish",
      "Partners share profits, losses, and liabilities",
      "Each partner is jointly and severally liable for partnership debts",
    ],
    advantages: [
      "Shared startup costs, resources, and expertise",
      "Simple and inexpensive to establish compared to a company",
      "Minimal reporting requirements",
      "Potential tax advantages through income splitting",
      "Flexible management structure",
    ],
    disadvantages: [
      "Joint and several liability - each partner is liable for all partnership debts",
      "Potential for disputes between partners",
      "Lack of continuity - partnership may need to be dissolved if a partner leaves",
      "Each partner bound by actions of other partners",
      "Limited ability to raise capital",
    ],
    taxConsiderations:
      "A partnership itself doesn't pay tax. Instead, each partner pays tax on their share of the partnership income at their individual tax rates. The partnership must lodge a partnership tax return.",
    suitableFor: [
      "Professional services (legal, accounting, medical practices)",
      "Family businesses",
      "Joint ventures between individuals",
      "Businesses where complementary skills are needed",
      "Situations where shared decision-making is desired",
    ],
    setupRequirements: [
      "Create a partnership agreement (highly recommended)",
      "Apply for an ABN for the partnership",
      "Register the business name",
      "Register for GST if turnover exceeds $75,000",
      "Open a partnership bank account",
    ],
  },
  Company: {
    title: "Company",
    description:
      "A company is a separate legal entity distinct from its shareholders. It can enter into contracts, sue and be sued, and is regulated by ASIC under the Corporations Act 2001.",
    keyFeatures: [
      "Separate legal entity from its owners",
      "Limited liability for shareholders",
      "Perpetual succession - continues regardless of changes in ownership",
      "More complex regulatory requirements",
      "Flat company tax rate",
    ],
    advantages: [
      "Limited liability protection for shareholders",
      "Potential tax advantages with the flat company tax rate",
      "Easier to raise capital and attract investors",
      "Perpetual succession - business continues despite changes in ownership",
      "Enhanced credibility and professional image",
    ],
    disadvantages: [
      "Higher setup and maintenance costs",
      "Complex regulatory and reporting requirements",
      "Less privacy - company information is publicly available",
      "Double taxation possible on distributed profits",
      "Directors have legal duties and responsibilities",
    ],
    taxConsiderations:
      "Companies pay a flat tax rate (currently 25% for small businesses with turnover less than $50 million, and 30% for larger companies). Shareholders pay tax on dividends received, with franking credits available for tax the company has already paid.",
    suitableFor: [
      "Medium to high-risk businesses",
      "Businesses seeking external investment",
      "Businesses planning significant growth",
      "Businesses with substantial assets",
      "Businesses that may be sold in the future",
    ],
    setupRequirements: [
      "Register with ASIC",
      "Create a company constitution",
      "Appoint directors and a company secretary",
      "Issue shares to shareholders",
      "Comply with ongoing ASIC reporting requirements",
    ],
  },
  "Discretionary Trust": {
    title: "Discretionary Trust",
    description:
      "A discretionary trust (also known as a family trust) is a structure where trustees hold assets for the benefit of beneficiaries. The trustee has discretion over how income and capital are distributed among beneficiaries.",
    keyFeatures: [
      "Trustee has discretion over distribution of income and capital",
      "Separation between control (trustee) and benefits (beneficiaries)",
      "Potential asset protection benefits",
      "Flexible income distribution for tax planning",
    ],
    advantages: [
      "Flexible income distribution for tax planning",
      "Asset protection benefits",
      "Potential access to small business CGT concessions",
      "Preservation of family assets across generations",
      "Privacy - trust details not publicly available",
    ],
    disadvantages: [
      "Complex structure to establish and maintain",
      "Higher setup and ongoing costs",
      "Trustee bears legal responsibility",
      "Limited life span (usually maximum 80 years)",
      "Losses trapped in trust cannot be distributed",
    ],
    taxConsiderations:
      "The trust itself is not taxed if all income is distributed to beneficiaries. Beneficiaries pay tax on trust income at their individual tax rates. Undistributed income is taxed at the highest marginal rate.",
    suitableFor: [
      "Family businesses",
      "Businesses with significant assets requiring protection",
      "Situations requiring flexible income distribution",
      "Estate planning purposes",
      "Businesses with varying profit levels year to year",
    ],
    setupRequirements: [
      "Create a trust deed",
      "Appoint a trustee (individual or company)",
      "Settle the trust with a small amount",
      "Apply for an ABN and TFN for the trust",
      "Open a bank account in the name of the trustee on behalf of the trust",
    ],
  },
  "Unit Trust": {
    title: "Unit Trust",
    description:
      "A unit trust is a structure where the trust's property is divided into fixed units, similar to shares in a company. Unit holders own a specific number of units representing their interest in the trust assets and income.",
    keyFeatures: [
      "Fixed entitlements to income and capital based on units held",
      "Similar to a company but with trust tax treatment",
      "Units can be transferred like shares",
      "Suitable for unrelated parties in business together",
    ],
    advantages: [
      "Fixed entitlements provide certainty for investors",
      "Easier to admit new investors or exit existing ones",
      "Potential tax advantages compared to a company",
      "Some asset protection benefits",
      "Access to trust tax concessions",
    ],
    disadvantages: [
      "Less flexibility in income distribution than discretionary trusts",
      "Complex and costly to establish and maintain",
      "Trustee bears legal responsibility",
      "Limited life span (usually maximum 80 years)",
      "Losses trapped in trust cannot be distributed",
    ],
    taxConsiderations:
      "Income is taxed in the hands of unit holders based on their proportional ownership. The trust must distribute income according to the fixed unit holdings, unlike the flexibility of a discretionary trust.",
    suitableFor: [
      "Joint ventures between unrelated parties",
      "Investment structures with multiple investors",
      "Property development or investment syndicates",
      "Businesses requiring defined ownership interests",
      "Situations where clear exit mechanisms are needed",
    ],
    setupRequirements: [
      "Create a unit trust deed",
      "Appoint a trustee (individual or company)",
      "Issue units to unit holders",
      "Apply for an ABN and TFN for the trust",
      "Register for GST if applicable",
    ],
  },
  "Discretionary or Unit Trust (based on owners)": {
    title: "Discretionary or Unit Trust",
    description:
      "This recommendation suggests either a Discretionary Trust or Unit Trust depending on the relationship between the owners and their specific needs for control and income distribution.",
    keyFeatures: [
      "Trust structure provides separation between legal ownership and beneficial ownership",
      "Asset protection benefits",
      "Different distribution options based on trust type",
      "Potential tax planning advantages",
    ],
    advantages: [
      "Asset protection for valuable business assets",
      "Tax planning flexibility (especially with discretionary trusts)",
      "Potential access to small business CGT concessions",
      "Separation between business operations and asset ownership",
      "Privacy compared to company structures",
    ],
    disadvantages: [
      "Complex and costly to establish and maintain",
      "Trustee bears legal responsibility",
      "Limited life span (usually maximum 80 years)",
      "Losses trapped in trust cannot be distributed",
      "Ongoing administration requirements",
    ],
    taxConsiderations:
      "Tax treatment depends on the specific trust type chosen. Discretionary trusts offer more flexibility in distributions, while unit trusts provide certainty with fixed entitlements.",
    suitableFor: [
      "Family businesses (discretionary trust)",
      "Joint ventures between unrelated parties (unit trust)",
      "Businesses with valuable appreciating assets",
      "Situations requiring asset protection",
      "Businesses with varying profit levels year to year",
    ],
    setupRequirements: [
      "Create an appropriate trust deed",
      "Appoint a trustee (individual or company)",
      "Settle the trust/issue units",
      "Apply for an ABN and TFN for the trust",
      "Consider a corporate trustee for additional protection",
    ],
  },
  "Trust (Discretionary or Unit depending on structure)": {
    title: "Trust Structure",
    description:
      "This recommendation suggests a trust structure (either Discretionary or Unit Trust) as the optimal choice for your situation, particularly for CGT planning purposes.",
    keyFeatures: [
      "Trust structure provides separation between legal ownership and beneficial ownership",
      "Potential access to small business CGT concessions",
      "Asset protection benefits",
      "Different distribution options based on trust type",
    ],
    advantages: [
      "Access to small business CGT concessions",
      "Asset protection benefits",
      "Potential tax planning advantages",
      "Flexibility in business succession planning",
      "Separation between business operations and asset ownership",
    ],
    disadvantages: [
      "Complex and costly to establish and maintain",
      "Trustee bears legal responsibility",
      "Limited life span (usually maximum 80 years)",
      "Losses trapped in trust cannot be distributed",
      "Ongoing administration requirements",
    ],
    taxConsiderations:
      "Trusts can provide significant CGT advantages, including access to the 50% CGT discount and small business CGT concessions. The specific tax treatment will depend on the type of trust chosen.",
    suitableFor: [
      "Businesses with valuable appreciating assets",
      "Business owners planning for eventual sale",
      "Family businesses with succession planning needs",
      "Situations requiring asset protection",
      "Businesses seeking to minimize CGT on eventual sale",
    ],
    setupRequirements: [
      "Create an appropriate trust deed",
      "Appoint a trustee (individual or company)",
      "Settle the trust/issue units",
      "Apply for an ABN and TFN for the trust",
      "Consider a corporate trustee for additional protection",
    ],
  },
  "Partnership or Sole Trader (based on number of owners)": {
    title: "Partnership or Sole Trader",
    description:
      "This recommendation suggests either a Partnership (if multiple owners) or Sole Trader (if single owner) structure based on your preference for simplicity and operational considerations.",
    keyFeatures: [
      "Simple and inexpensive to establish",
      "Minimal regulatory requirements",
      "Direct control over business operations",
      "Income taxed at individual tax rates",
    ],
    advantages: [
      "Low setup and ongoing costs",
      "Simple regulatory and tax obligations",
      "Direct control over business operations",
      "Minimal reporting requirements",
      "Flexibility to change structure as business grows",
    ],
    disadvantages: [
      "Unlimited personal liability",
      "Limited access to capital for growth",
      "Potential difficulties in business succession",
      "Limited tax planning opportunities",
      "For partnerships: potential disputes between partners",
    ],
    taxConsiderations:
      "Business income is taxed at individual tax rates. For partnerships, each partner pays tax on their share of partnership income. These structures allow business losses to offset other personal income.",
    suitableFor: [
      "New or small businesses with low risk",
      "Service-based businesses with minimal capital requirements",
      "Businesses with simple operations",
      "Situations where minimizing administrative burden is important",
      "Businesses with low startup capital requirements",
    ],
    setupRequirements: [
      "Apply for an ABN",
      "Register business name (if applicable)",
      "For partnerships: create a partnership agreement",
      "Register for GST if turnover exceeds $75,000",
      "Set up proper accounting records",
    ],
  },
  "Sole Trader or Partnership (based on number of owners)": {
    title: "Sole Trader or Partnership",
    description:
      "This recommendation suggests either a Sole Trader (if single owner) or Partnership (if multiple owners) structure based on your preference for simplicity and operational considerations.",
    keyFeatures: [
      "Simple and inexpensive to establish",
      "Minimal regulatory requirements",
      "Direct control over business operations",
      "Income taxed at individual tax rates",
    ],
    advantages: [
      "Low setup and ongoing costs",
      "Simple regulatory and tax obligations",
      "Direct control over business operations",
      "Minimal reporting requirements",
      "Ability to offset business losses against other income",
    ],
    disadvantages: [
      "Unlimited personal liability",
      "Limited access to capital for growth",
      "Potential difficulties in business succession",
      "Limited tax planning opportunities",
      "For partnerships: potential disputes between partners",
    ],
    taxConsiderations:
      "Business income is taxed at individual tax rates. For partnerships, each partner pays tax on their share of partnership income. These structures allow business losses to offset other personal income.",
    suitableFor: [
      "New or small businesses with low risk",
      "Service-based businesses with minimal capital requirements",
      "Businesses with simple operations",
      "Situations where minimizing administrative burden is important",
      "Businesses expecting initial losses that can offset other income",
    ],
    setupRequirements: [
      "Apply for an ABN",
      "Register business name (if applicable)",
      "For partnerships: create a partnership agreement",
      "Register for GST if turnover exceeds $75,000",
      "Set up proper accounting records",
    ],
  },
  "Sole Trader or Partnership (based on prior answers)": {
    title: "Sole Trader or Partnership",
    description:
      "Based on your focus on operational simplicity, this recommendation suggests either a Sole Trader (if single owner) or Partnership (if multiple owners) structure.",
    keyFeatures: [
      "Simple and inexpensive to establish",
      "Minimal regulatory requirements",
      "Direct control over business operations",
      "Income taxed at individual tax rates",
    ],
    advantages: [
      "Low setup and ongoing costs",
      "Simple regulatory and tax obligations",
      "Direct control over business operations",
      "Minimal reporting requirements",
      "Flexibility to change structure as business grows",
    ],
    disadvantages: [
      "Unlimited personal liability",
      "Limited access to capital for growth",
      "Potential difficulties in business succession",
      "Limited tax planning opportunities",
      "For partnerships: potential disputes between partners",
    ],
    taxConsiderations:
      "Business income is taxed at individual tax rates. For partnerships, each partner pays tax on their share of partnership income. These structures have the simplest tax obligations of all business structures.",
    suitableFor: [
      "New or small businesses with low risk",
      "Service-based businesses with minimal capital requirements",
      "Businesses with simple operations",
      "Situations where minimizing administrative burden is important",
      "Businesses where operational simplicity is the primary concern",
    ],
    setupRequirements: [
      "Apply for an ABN",
      "Register business name (if applicable)",
      "For partnerships: create a partnership agreement",
      "Register for GST if turnover exceeds $75,000",
      "Set up proper accounting records",
    ],
  },
}

