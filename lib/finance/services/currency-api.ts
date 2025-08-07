/**
 * Currency Exchange API Service
 * Uses the free Fawaz Ahmed Currency API for real-time exchange rates
 * API Documentation: https://github.com/fawazahmed0/exchange-api
 */

import {
  ConversionResult,
  CurrencyApiResponse,
  CurrencyListResponse,
  ExchangeRate,
} from "@/lib/finance/types/currency";

// API Configuration
const API_BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1";
const FALLBACK_API_URL = "https://latest.currency-api.pages.dev/v1";

/**
 * Fetch data with fallback mechanism for currency list
 */
async function fetchCurrencyList(
  endpoint: string
): Promise<CurrencyListResponse> {
  try {
    // Try primary API first
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("Primary API failed, trying fallback:", error);

    try {
      // Try fallback API
      const fallbackResponse = await fetch(`${FALLBACK_API_URL}${endpoint}`);
      if (!fallbackResponse.ok) {
        throw new Error(
          `Fallback API HTTP error! status: ${fallbackResponse.status}`
        );
      }
      return await fallbackResponse.json();
    } catch (fallbackError) {
      console.error("Both APIs failed:", fallbackError);
      throw new Error("Unable to fetch currency data from any API source");
    }
  }
}

/**
 * Fetch data with fallback mechanism for exchange rates
 */
async function fetchExchangeRates(
  endpoint: string
): Promise<CurrencyApiResponse> {
  try {
    // Try primary API first
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("Primary API failed, trying fallback:", error);

    try {
      // Try fallback API
      const fallbackResponse = await fetch(`${FALLBACK_API_URL}${endpoint}`);
      if (!fallbackResponse.ok) {
        throw new Error(
          `Fallback API HTTP error! status: ${fallbackResponse.status}`
        );
      }
      return await fallbackResponse.json();
    } catch (fallbackError) {
      console.error("Both APIs failed:", fallbackError);
      throw new Error("Unable to fetch currency data from any API source");
    }
  }
}

/**
 * Get list of all available currencies
 */
export async function getAllCurrencies(): Promise<CurrencyListResponse> {
  try {
    const data = await fetchCurrencyList("/currencies.json");
    return data;
  } catch (error) {
    console.error("Error fetching currencies:", error);
    throw new Error("Failed to fetch currency list");
  }
}

/**
 * Get exchange rates for a base currency
 */
export async function getExchangeRates(
  baseCurrency: string
): Promise<ExchangeRate> {
  try {
    const normalizedBase = baseCurrency.toLowerCase();
    const data: CurrencyApiResponse = await fetchExchangeRates(
      `/currencies/${normalizedBase}.json`
    );

    // The API returns data in format: { date: "2024-01-01", baseCurrency: { targetCurrency: rate, ... } }
    const ratesData = data[normalizedBase];

    if (!ratesData || typeof ratesData !== "object") {
      throw new Error(`No exchange rates found for ${baseCurrency}`);
    }

    return ratesData as ExchangeRate;
  } catch (error) {
    console.error(`Error fetching exchange rates for ${baseCurrency}:`, error);
    throw new Error(`Failed to fetch exchange rates for ${baseCurrency}`);
  }
}

/**
 * Convert currency amount between two currencies
 */
export async function convertCurrency(
  fromCurrency: string,
  toCurrency: string,
  amount: number
): Promise<ConversionResult> {
  try {
    const normalizedFrom = fromCurrency.toLowerCase();
    const normalizedTo = toCurrency.toLowerCase();

    // If converting to the same currency, return 1:1 rate
    if (normalizedFrom === normalizedTo) {
      return {
        fromCurrency: fromCurrency.toUpperCase(),
        toCurrency: toCurrency.toUpperCase(),
        fromAmount: amount,
        toAmount: amount,
        exchangeRate: 1,
        lastUpdated: new Date().toISOString(),
      };
    }

    // Get exchange rates for the base currency
    const data: CurrencyApiResponse = await fetchExchangeRates(
      `/currencies/${normalizedFrom}.json`
    );
    const ratesData = data[normalizedFrom];

    if (!ratesData || typeof ratesData !== "object") {
      throw new Error(`No exchange rates found for ${fromCurrency}`);
    }

    const exchangeRate = ratesData[normalizedTo];

    if (exchangeRate === undefined || exchangeRate === null) {
      throw new Error(
        `Exchange rate not found for ${fromCurrency} to ${toCurrency}`
      );
    }

    const convertedAmount = amount * exchangeRate;

    return {
      fromCurrency: fromCurrency.toUpperCase(),
      toCurrency: toCurrency.toUpperCase(),
      fromAmount: amount,
      toAmount: convertedAmount,
      exchangeRate: exchangeRate,
      lastUpdated: data.date || new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error converting ${fromCurrency} to ${toCurrency}:`, error);
    throw new Error(`Failed to convert ${fromCurrency} to ${toCurrency}`);
  }
}

/**
 * Get historical exchange rate for a specific date
 */
export async function getHistoricalRate(
  fromCurrency: string,
  toCurrency: string,
  date: string // Format: YYYY-MM-DD
): Promise<number> {
  try {
    const normalizedFrom = fromCurrency.toLowerCase();
    const normalizedTo = toCurrency.toLowerCase();

    // Construct historical API URL
    const historicalUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${normalizedFrom}.json`;

    const response = await fetch(historicalUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CurrencyApiResponse = await response.json();
    const ratesData = data[normalizedFrom];

    if (!ratesData || typeof ratesData !== "object") {
      throw new Error(
        `No historical rates found for ${fromCurrency} on ${date}`
      );
    }

    const rate = ratesData[normalizedTo];

    if (rate === undefined || rate === null) {
      throw new Error(
        `Historical rate not found for ${fromCurrency} to ${toCurrency} on ${date}`
      );
    }

    return rate;
  } catch (error) {
    console.error(
      `Error fetching historical rate for ${fromCurrency} to ${toCurrency} on ${date}:`,
      error
    );
    throw new Error(`Failed to fetch historical rate for ${date}`);
  }
}

/**
 * Get multiple exchange rates for comparison
 */
export async function getMultipleRates(
  baseCurrency: string,
  targetCurrencies: string[]
): Promise<{ [currency: string]: number }> {
  try {
    const rates = await getExchangeRates(baseCurrency);
    const result: { [currency: string]: number } = {};

    for (const currency of targetCurrencies) {
      const normalizedCurrency = currency.toLowerCase();
      if (rates[normalizedCurrency] !== undefined) {
        result[currency.toUpperCase()] = rates[normalizedCurrency];
      }
    }

    return result;
  } catch (error) {
    console.error("Error fetching multiple rates:", error);
    throw new Error("Failed to fetch multiple exchange rates");
  }
}

/**
 * Check if API is available and working
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/currencies.json`);
    return response.ok;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
}

/**
 * Format currency amount with proper currency symbol
 */
export function formatCurrencyAmount(
  amount: number,
  currencyCode: string,
  locale: string = "en-US"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(amount);
  } catch (error) {
    // Fallback if currency code is not supported by Intl
    console.warn(`Currency formatting failed for ${currencyCode}:`, error);
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}
