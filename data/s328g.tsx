export const criteriaData = [
    {
      id: 1,
      title: "Genuine Restructure of an Ongoing Business",
      description: "The transaction is, or is a part of, a 'genuine restructure of an ongoing business'.",
      legislativeReference: "Section 328-430(1)(a) of the Income Tax Assessment Act 1997",
      detailedExplanation: [
        "A 'genuine restructure of an ongoing business' means the business continues to operate following the transfer, but in a different legal structure. The restructure should be for genuine commercial reasons such as asset protection, maintaining essential employees, raising capital, or simplifying affairs.",
        "The Commissioner has provided guidance in Law Companion Ruling 2016/3 on factors that indicate a genuine restructure, including that it is a bona fide commercial arrangement undertaken to facilitate growth, innovation, diversification, adapt to changed conditions, or reduce administrative burdens.",
        "A 'safe harbour rule' in section 328-435 provides that an SBE will be taken to satisfy this condition where, among other things, there is no change in the ultimate economic ownership of any of the significant assets of the business for three years following the roll-over.",
      ],
      examples: [
        {
          title: "Asset Protection",
          description: "Sole trader transfers business to a discretionary trust with corporate trustee.",
          satisfies: true,
          keyFacts: [
            "Sole trader is primary individual specified in the Family Trust Election (FTE) for the trust",
            "Restructure is in response to business needs, facilitates further growth (expanding riskier operations)",
            "Not unduly tax driven",
            "Evidence supports asset protection motive",
          ],
        },
        {
          title: "Maintaining Essential Employees",
          description:
            "Family discretionary trust transfers active assets to a company to allow for issuing shares to essential employees.",
          satisfies: true,
          keyFacts: [
            "Business run in family discretionary trust by three siblings",
            "Active assets transferred to company owned by the siblings",
            "Purpose is to allow for issuing of shares to essential employees",
            "Brings commercial, but no additional tax advantage",
            "If shares issued to employees within three years, business cannot use the safe harbour rule but the genuine restructure requirement satisfied in any case",
          ],
        },
        {
          title: "Raising New Capital",
          description:
            "Partners transfer business to a new company owned in same proportions as their interests in the partnership assets.",
          satisfies: true,
          keyFacts: [
            "Partners transfer business to new company owned in same proportions as their interests in the partnership assets",
            "Aim is to allow for capital contribution by a new investor in return for an equity stake",
            "Potential new investment is not part of the restructure for SBRR purposes",
            "The new investor provides a fresh source of capital required to facilitate growth",
            "No divestment of the business by the original owners who continue to operate the business",
          ],
        },
        {
          title: "Disposal of Business",
          description:
            "Company transfers assets to a sole trader to facilitate the sale of the business 12 months later.",
          satisfies: false,
          keyFacts: [
            "Transfer is to facilitate the sale of the business, 12 months later, to a buyer who does not want to buy the shares",
            "The shareholder wants to be able to take advantage of the 50 per cent discount",
            "The restructure is a preliminary step to facilitate the economic realisation of assets",
          ],
        },
      ],
      keyConsiderations: [
        "The business must continue to operate after the restructure",
        "The restructure should be for genuine commercial reasons, not tax avoidance",
        "The safe harbour rule may apply if the business continues for at least 3 years after the transfer",
        "Restructures that are preliminary steps to facilitate the disposal of business assets do not qualify",
        "The economic ownership of the business and its restructured assets should be maintained",
      ],
      additionalNotes: [
        "Factors indicating a transaction is NOT a genuine restructure include: it being a preliminary step to facilitate economic realisation of assets, effecting an extraction of wealth from business assets for personal use, creating artificial losses, or effecting a permanent non-recognition of gain.",
        "The safe harbour rule in section 328-435 provides certainty where the ultimate economic ownership of significant assets remains unchanged for 3 years after the transfer.",
      ],
    },
    {
      id: 2,
      title: "Eligible Entities",
      description: "Each party to the transfer is an eligible entity as defined in the legislation.",
      legislativeReference: "Section 328-430(1)(b) of the Income Tax Assessment Act 1997",
      detailedExplanation: [
        "Each party to the transfer must be one of the following for the income year in which the transfer occurs:",
        "- An SBE (Small Business Entity)",
        "- An entity that has an affiliate that is an SBE",
        "- An entity that is connected with an entity that is an SBE, or",
        "- A partner in a partnership that is an SBE.",
        "An entity is an SBE if it carries on a business in the current income year and satisfies the aggregated turnover test (less than $10 million).",
      ],
      examples: [
        {
          title: "Direct Small Business Entity",
          description: "A business with aggregated turnover of $5 million transfers assets to a newly created company.",
          satisfies: true,
          keyFacts: [
            "Business carries on business activities",
            "Aggregated turnover is less than $10 million",
            "Both transferor and transferee meet the SBE requirements",
          ],
        },
        {
          title: "Connected Entity",
          description: "A holding company that is connected with an SBE transfers assets to another entity.",
          satisfies: true,
          keyFacts: [
            "Holding company does not itself qualify as an SBE",
            "Holding company is connected with an operating company that is an SBE",
            "The connection meets the control requirements in the tax law",
          ],
        },
      ],
      keyConsiderations: [
        "Aggregated turnover includes the turnover of connected entities and affiliates",
        "The $10 million threshold applies to the income year in which the transfer occurs",
        "Both transferor and transferee must meet the requirement",
        "Passive entities can access the SBRR provided they have an affiliate that is an SBE, are connected with an SBE, or are a partner in a partnership that is an SBE",
        "Exempt entities and complying superannuation entities are excluded under section 328-430(2)",
      ],
      additionalNotes: [
        "An entity's aggregated turnover is the sum of the annual turnovers for the income year of the entity being tested, any entities connected with the entity, and any affiliates of the entity.",
        "An entity can qualify as an SBE using either the 'look back' test (previous year's turnover), 'look forward' test (likely turnover for current year), or 'actual turnover' test (actual turnover for current year).",
      ],
    },
    {
      id: 3,
      title: "Ultimate Economic Ownership",
      description:
        "The transaction does not have the effect of materially changing which individual has, or which individuals have, the ultimate economic ownership of the asset.",
      legislativeReference: "Section 328-430(1)(c) of the Income Tax Assessment Act 1997",
      detailedExplanation: [
        "The ultimate economic ownership refers to the individuals who economically own the assets before and after the transfer. For a discretionary trust, the individuals who have ultimate economic ownership are those who, as a result of the exercise of the trustee's discretion, would be reasonably expected to receive the economic benefits of the assets.",
        "The transaction must not materially change which individual has, or which individuals have, the ultimate economic ownership of the asset. If there is more than one such individual, the transaction must not materially change each individual's share of that ultimate economic ownership.",
        "This requirement ensures that the rollover relief is only available for genuine restructures where the same individuals continue to economically own the business assets, albeit through a different legal structure.",
      ],
      examples: [
        {
          title: "Partnership to Company",
          description:
            "Partners transfer business to a new company owned in the same proportions as their interests in the partnership assets.",
          satisfies: true,
          keyFacts: [
            "Partners transfer business to new company",
            "Company is owned in same proportions as their interests in the partnership assets",
            "No change in ultimate economic ownership",
          ],
        },
        {
          title: "Succession Planning",
          description:
            "A company transfers assets to another company, and within three years, the shareholder sells the shares in each company to different sons.",
          satisfies: false,
          keyFacts: [
            "Active assets of one of two businesses operated in a company are transferred to a new company owned by the same shareholder",
            "Within three years of the transfer, the shareholder retires and sells the shares in the first company to one son and the shares in the other company to his second son",
            "The ultimate economic ownership changes from the original shareholder to the sons",
          ],
        },
      ],
      keyConsiderations: [
        "The same individuals must economically own the assets before and after the transfer",
        "For discretionary trusts, consider who would reasonably be expected to receive the economic benefits",
        "Small changes in ownership percentages may be acceptable if they are incidental to the restructure",
        "Restructures that facilitate succession planning with significant ownership changes do not qualify",
        "The test looks at the economic substance rather than just the legal form of ownership",
      ],
    },
    {
      id: 4,
      title: "Eligible Assets",
      description: "The assets being transferred are eligible assets as defined in the legislation.",
      legislativeReference: "Section 328-430(1)(d) of the Income Tax Assessment Act 1997",
      detailedExplanation: [
        "The eligibility of assets depends on whether the transferor is an SBE or not:",
        "- If the transferor is an SBE, the asset being transferred must be a CGT asset that is an active asset as defined in section 152-40 (which broadly includes assets used in a business).",
        "- If the transferor is not an SBE but is either an entity connected with an SBE or an entity that has an affiliate that is an SBE, the asset must be an active asset that satisfies section 152-10(1A), which among other things requires that the relevant SBE carries on business in relation to the asset.",
        "- If the transferor is a partner in a partnership that is an SBE, the asset must be an active asset and an interest in an asset of the partnership.",
        "An active asset is generally one that is used, or held ready for use, in the course of carrying on a business.",
      ],
      examples: [
        {
          title: "Business Equipment Transfer",
          description:
            "A sole trader transfers machinery, tools, and business premises used in their manufacturing business to a company.",
          satisfies: true,
          keyFacts: [
            "Assets are used in carrying on the business",
            "Assets qualify as active assets under section 152-40",
            "Assets are CGT assets",
          ],
        },
        {
          title: "Investment Property Transfer",
          description:
            "A business transfers a rental property that is not used in the business operations to another entity.",
          satisfies: false,
          keyFacts: [
            "Property is not used in carrying on the business",
            "Property is a passive investment asset",
            "Does not qualify as an active asset under section 152-40",
          ],
        },
      ],
      keyConsiderations: [
        "The asset must be used or held ready for use in carrying on a business",
        "Passive investment assets generally do not qualify",
        "Assets must be active assets just before the transfer",
        "Different rules apply depending on whether the transferor is an SBE, connected with an SBE, or a partner in an SBE partnership",
        "The rollover can apply to CGT assets, depreciating assets, trading stock, and revenue assets",
      ],
      additionalNotes: [
        "Roll-over relief is available for depreciating assets under section 40-340 where the SBRR would be available in relation to the asset if the asset were not a depreciating asset.",
        "Section 328-243(1A)(c) provides that roll-over relief is available for pooled assets.",
      ],
    },
    {
      id: 5,
      title: "Residency Requirement",
      description: "The transferor and each transferee meet the residency requirement specified in the legislation.",
      legislativeReference: "Sections 328-430(1)(e) and 328-445 of the Income Tax Assessment Act 1997",
      detailedExplanation: [
        "Both the transferor and the transferee of the assets must be residents of Australia. The specific residency test depends on the type of entity:",
        "- Individual or company: must be an Australian resident",
        "- Trust: must be a resident trust for CGT purposes",
        "- Partnership (other than corporate limited partnership): must have at least one partner that is an Australian resident",
        "- Corporate limited partnership: must be a resident for the purposes of the income tax law under section 94T of the ITAA 1936.",
        "This requirement ensures that the assets remain within the Australian tax system after the restructure.",
      ],
      examples: [
        {
          title: "Domestic Restructure",
          description:
            "An Australian sole trader transfers business assets to an Australian company owned by the same individual.",
          satisfies: true,
          keyFacts: [
            "Sole trader is an Australian resident",
            "Company is incorporated in Australia and is an Australian resident",
            "Both transferor and transferee meet their respective residency tests",
          ],
        },
        {
          title: "Offshore Transfer",
          description:
            "An Australian business transfers assets to a company incorporated and resident in a foreign jurisdiction.",
          satisfies: false,
          keyFacts: [
            "Transferor is an Australian resident",
            "Transferee company is not an Australian resident",
            "Transferee fails to meet the residency requirement",
          ],
        },
      ],
      keyConsiderations: [
        "Different residency tests apply to different entity types (individuals, companies, trusts, partnerships)",
        "For trusts, the residency test is the same as for CGT purposes",
        "For partnerships, at least one partner must be an Australian resident",
        "The residency status is determined at the time of the transfer",
        "Both transferor and transferee must meet their respective residency requirements",
      ],
    },
    {
      id: 6,
      title: "Choice to Apply Rollover",
      description:
        "The transferor and each transferee choose to apply a rollover under this Subdivision in relation to the assets transferred under the transaction.",
      legislativeReference: "Section 328-430(1)(f) of the Income Tax Assessment Act 1997",
      detailedExplanation: [
        "The transferor and transferee must both choose to apply the rollover. This is a formal requirement that ensures both parties agree to the tax consequences of the rollover.",
        "The choice is made on an asset-by-asset basis, and once made cannot be amended or revoked. This means that parties can choose which assets will be subject to the rollover and which will not.",
        "The way the transferee and transferor prepare their income tax returns is generally sufficient evidence of the making of a choice. However, it would be prudent for both transferee and transferor to make and keep a written record of assets for which the SBRR has been chosen.",
        "If the SBRR concession is not chosen, the normal tax consequences of transferring assets occur (e.g., CGT, balancing adjustment, or assessable income).",
      ],
      examples: [
        {
          title: "Documented Choice",
          description:
            "A business and its new entity document their choice to apply the rollover and reflect this in their tax returns.",
          satisfies: true,
          keyFacts: [
            "Both transferor and transferee formally document their choice to apply the rollover",
            "The choice is reflected in how they prepare their income tax returns",
            "They maintain written records of the assets for which the SBRR has been chosen",
          ],
        },
        {
          title: "Partial Application",
          description: "A business chooses to apply the rollover to some assets but not others in a restructure.",
          satisfies: true,
          keyFacts: [
            "Business transfers multiple assets as part of a restructure",
            "Both parties choose to apply the rollover to specific assets only",
            "Normal tax consequences apply to assets not covered by the choice",
            "The choice is made on an asset-by-asset basis",
          ],
        },
      ],
      keyConsiderations: [
        "The choice must be made by both the transferor and transferee",
        "The choice is made on an asset-by-asset basis",
        "Once made, the choice cannot be amended or revoked",
        "The way tax returns are prepared is generally sufficient evidence of the choice",
        "It is advisable to maintain written documentation of the choice",
      ],
      additionalNotes: [
        "The SBRR can apply to gains or losses from CGT assets, depreciating assets, trading stock, and/or revenue assets.",
        "When the rollover is chosen, the income tax law applies to the transferor as if the transfer takes place for the asset's roll-over cost, resulting in no gain or loss for the transferor.",
        "The transferee is taken to have acquired each asset for an amount that equals the transferor's cost just before the transfer.",
      ],
    },
  ]
  
  