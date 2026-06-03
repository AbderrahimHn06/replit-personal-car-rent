import { makeStore } from "./baseStore";
import { CurrencyCode, LanguageCode, Money } from "./types";
import { TRANSLATIONS, type TranslationKey } from "@/i18n/translations";

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = { DZD: "DA", USD: "$", EUR: "€" };
export const CURRENCY_NAMES: Record<CurrencyCode, string> = { DZD: "Algerian Dinar (DZD)", USD: "US Dollar (USD)", EUR: "Euro (EUR)" };
export const CURRENCY_RATES: Record<CurrencyCode, number> = { DZD: 135, USD: 1, EUR: 0.92 };

export const LANGUAGE_NAMES: Record<LanguageCode, string> = { fr: "Français", en: "English", ar: "العربية" };

export interface CurrencySettings {
  mainCurrency: CurrencyCode;
  supportedCurrencies: CurrencyCode[];
}

export interface LanguageSettings {
  mainLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
}

export const currencyStore = makeStore<CurrencySettings>("currency", {
  mainCurrency: "DZD",
  supportedCurrencies: ["DZD", "USD", "EUR"],
});

export const languageStore = makeStore<LanguageSettings>("language", {
  mainLanguage: "fr",
  supportedLanguages: ["fr", "en", "ar"],
});

export function useCurrencySettings() {
  return currencyStore.useValue();
}

export function getCurrencySettings() {
  return currencyStore.getValue();
}

export function updateCurrencySettings(s: Partial<CurrencySettings>) {
  currencyStore.setValue({ ...currencyStore.getValue(), ...s });
}

export function useLanguageSettings() {
  return languageStore.useValue();
}

export function getLanguageSettings() {
  return languageStore.getValue();
}

export function updateLanguageSettings(s: Partial<LanguageSettings>) {
  languageStore.setValue({ ...languageStore.getValue(), ...s });
}

// Translation helpers
export function useT() {
  const { mainLanguage } = useLanguageSettings();
  return (key: TranslationKey, vars?: Record<string, string | number>) => {
    let text = TRANSLATIONS[mainLanguage][key] ?? TRANSLATIONS["fr"][key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };
}

export function getT() {
  const { mainLanguage } = getLanguageSettings();
  return (key: TranslationKey) => {
    return TRANSLATIONS[mainLanguage][key] ?? TRANSLATIONS["fr"][key] ?? key;
  };
}

export function isRTL() {
  return languageStore.getValue().mainLanguage === "ar";
}

// Money Conversion & Formatting Helper
export function convertMoney(m: Money, targetCode: CurrencyCode): Money {
  if (m.currencyCode === targetCode) return m;
  const rateInUSD = m.amount / CURRENCY_RATES[m.currencyCode];
  const targetAmount = Math.round(rateInUSD * CURRENCY_RATES[targetCode]);
  return { amount: targetAmount, currencyCode: targetCode };
}

export function formatMoney(m: Money, mcOverride?: CurrencyCode): string {
  const target = mcOverride || currencyStore.getValue().mainCurrency;
  const converted = convertMoney(m, target);
  return `${CURRENCY_SYMBOLS[converted.currencyCode]} ${converted.amount.toLocaleString()}`;
}

export function formatMoneyRaw(amount: number, fromCurrency: CurrencyCode, toCurrency?: CurrencyCode): string {
  return formatMoney({ amount, currencyCode: fromCurrency }, toCurrency);
}
