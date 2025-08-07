/**
 * Currency Converter Types
 * Defines all interfaces and types for currency conversion
 */

export interface Currency {
  code: string;
  name: string;
  symbol?: string;
  flag?: string;
}

export interface ExchangeRate {
  [currencyCode: string]: number;
}

export interface CurrencyResponse {
  date: string;
  [baseCurrency: string]: ExchangeRate | string;
}

export interface ConversionResult {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  lastUpdated: string;
}

export interface CurrencyFormData {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
}

export interface CurrencyApiResponse {
  date: string;
  [key: string]: ExchangeRate | string;
}

// Major world currencies with their symbols and names
export const POPULAR_CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£", flag: "🇪🇬" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
];

// Cryptocurrency currencies
export const CRYPTO_CURRENCIES: Currency[] = [
  { code: "BTC", name: "Bitcoin", symbol: "₿", flag: "₿" },
  { code: "ETH", name: "Ethereum", symbol: "Ξ", flag: "Ξ" },
  { code: "LTC", name: "Litecoin", symbol: "Ł", flag: "Ł" },
  { code: "XRP", name: "Ripple", symbol: "XRP", flag: "⚡" },
  { code: "ADA", name: "Cardano", symbol: "₳", flag: "₳" },
  { code: "DOT", name: "Polkadot", symbol: "DOT", flag: "●" },
  { code: "DOGE", name: "Dogecoin", symbol: "Ð", flag: "🐕" },
];

// Combined list for dropdown
export const ALL_CURRENCIES: Currency[] = [
  ...POPULAR_CURRENCIES,
  ...CRYPTO_CURRENCIES,
];

export interface CurrencyListResponse {
  [currencyCode: string]: string;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}

export interface CurrencyTrend {
  currency: string;
  trend: "up" | "down" | "stable";
  changePercent: number;
  historical: HistoricalRate[];
}
