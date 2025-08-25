"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

// Industry options from the KPI dashboard
const INDUSTRY_OPTIONS = [
  {
    value: "technology",
    label: "Technology",
    description: "Software, IT services, and digital technology companies",
  },
  {
    value: "retail",
    label: "Retail",
    description: "Consumer goods, e-commerce, and retail services",
  },
  {
    value: "manufacturing",
    label: "Manufacturing",
    description: "Industrial manufacturing and production",
  },
  {
    value: "professional_services",
    label: "Professional Services",
    description: "Consulting, legal, accounting, and professional services",
  },
  {
    value: "healthcare",
    label: "Healthcare",
    description: "Medical services, pharmaceuticals, and healthcare technology",
  },
  {
    value: "construction",
    label: "Construction",
    description: "Building, infrastructure, and construction services",
  },
  {
    value: "hospitality",
    label: "Hospitality",
    description: "Hotels, restaurants, and tourism services",
  },
  {
    value: "real_estate",
    label: "Real Estate",
    description: "Property development, management, and real estate services",
  },
  {
    value: "education",
    label: "Education",
    description: "Educational institutions and training services",
  },
  {
    value: "transport_logistics",
    label: "Transport & Logistics",
    description: "Transportation, logistics, and supply chain services",
  },
  {
    value: "other",
    label: "Other",
    description: "Other industries not listed above",
  },
];

const COMPANY_SIZE_OPTIONS = [
  {
    value: "startup",
    label: "Startup",
    description: "Early-stage company, typically 1-10 employees",
  },
  {
    value: "sme",
    label: "SME",
    description: "Small to medium enterprise, typically 11-250 employees",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Large company, typically 250+ employees",
  },
];

const BUSINESS_TYPE_OPTIONS = [
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "private_limited", label: "Private Limited Company" },
  { value: "public_limited", label: "Public Limited Company" },
  { value: "trust", label: "Trust" },
  { value: "other", label: "Other" },
];

interface CompanyInfo {
  // Basic Information
  companyName: string;
  tradingName: string;
  abn: string;
  acn: string;
  businessType: string;

  // Contact Information
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  email: string;
  website: string;

  // Business Details
  industry: string;
  companySize: string;
  foundedYear: string;
  employeeCount: string;

  // Financial Information
  financialYearEnd: string;
  taxRate: number;
  reportingCurrency: string;

  // Additional Information
  description: string;
  keyProducts: string;
  targetMarket: string;
  competitiveAdvantages: string;
}

const defaultCompanyInfo: CompanyInfo = {
  companyName: "",
  tradingName: "",
  abn: "",
  acn: "",
  businessType: "",
  address: "",
  city: "",
  state: "",
  postcode: "",
  country: "Australia",
  phone: "",
  email: "",
  website: "",
  industry: "",
  companySize: "",
  foundedYear: "",
  employeeCount: "",
  financialYearEnd: "30 June",
  taxRate: 25,
  reportingCurrency: "AUD",
  description: "",
  keyProducts: "",
  targetMarket: "",
  competitiveAdvantages: "",
};

export function CompanyInfo() {
  const { setTaxRate } = useFinancialStore();
  const [companyInfo, setCompanyInfo] =
    useState<CompanyInfo>(defaultCompanyInfo);

  const handleInputChange = (
    field: keyof CompanyInfo,
    value: string | number | boolean
  ) => {
    setCompanyInfo((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update tax rate in the store when it changes
    if (field === "taxRate" && typeof value === "number") {
      setTaxRate(value);
    }
  };

  // Load saved data on component mount
  useEffect(() => {
    const saved = localStorage.getItem("companyInfo");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompanyInfo(parsed);
        // Also update the tax rate in the store
        if (parsed.taxRate) {
          setTaxRate(parsed.taxRate);
        }
      } catch (error) {
        console.error("Error loading saved company info:", error);
      }
    }
  }, [setTaxRate]);

  // Auto-save changes with a short debounce
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        localStorage.setItem("companyInfo", JSON.stringify(companyInfo));
      } catch (error) {
        console.error("Error saving company info:", error);
      }
    }, 400);
    return () => window.clearTimeout(timeoutId);
  }, [companyInfo]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between"></div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5" /> Company Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={companyInfo.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="tradingName">Trading Name</Label>
              <Input
                id="tradingName"
                value={companyInfo.tradingName}
                onChange={(e) =>
                  handleInputChange("tradingName", e.target.value)
                }
                placeholder="Trading name (if different)"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="abn">ABN</Label>
              <Input
                id="abn"
                value={companyInfo.abn}
                onChange={(e) => handleInputChange("abn", e.target.value)}
                placeholder="Australian Business Number"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="acn">ACN</Label>
              <Input
                id="acn"
                value={companyInfo.acn}
                onChange={(e) => handleInputChange("acn", e.target.value)}
                placeholder="Australian Company Number"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                value={companyInfo.businessType}
                onValueChange={(value) =>
                  handleInputChange("businessType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={companyInfo.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Street address"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={companyInfo.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={companyInfo.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="State"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                value={companyInfo.postcode}
                onChange={(e) => handleInputChange("postcode", e.target.value)}
                placeholder="Postcode"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={companyInfo.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="Country"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={companyInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={companyInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Email address"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={companyInfo.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="Website URL"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="industry">Industry *</Label>
              <Select
                value={companyInfo.industry}
                onValueChange={(value) => handleInputChange("industry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="companySize">Company Size *</Label>
              <Select
                value={companyInfo.companySize}
                onValueChange={(value) =>
                  handleInputChange("companySize", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                type="number"
                value={companyInfo.foundedYear}
                onChange={(e) =>
                  handleInputChange("foundedYear", e.target.value)
                }
                placeholder="e.g., 2020"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="employeeCount">Number of Employees</Label>
              <Input
                id="employeeCount"
                type="number"
                value={companyInfo.employeeCount}
                onChange={(e) =>
                  handleInputChange("employeeCount", e.target.value)
                }
                placeholder="e.g., 25"
                min="1"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="financialYearEnd">Financial Year End</Label>
              <Select
                value={companyInfo.financialYearEnd}
                onValueChange={(value) =>
                  handleInputChange("financialYearEnd", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 June">30 June</SelectItem>
                  <SelectItem value="31 December">31 December</SelectItem>
                  <SelectItem value="31 March">31 March</SelectItem>
                  <SelectItem value="30 September">30 September</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={companyInfo.taxRate}
                onChange={(e) =>
                  handleInputChange("taxRate", parseFloat(e.target.value) || 0)
                }
                placeholder="30"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="reportingCurrency">Reporting Currency</Label>
              <Select
                value={companyInfo.reportingCurrency}
                onValueChange={(value) =>
                  handleInputChange("reportingCurrency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
