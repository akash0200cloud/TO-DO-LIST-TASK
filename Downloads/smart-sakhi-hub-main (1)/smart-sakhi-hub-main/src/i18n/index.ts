import en from "./translations/en";
import hi from "./translations/hi";
import ta from "./translations/ta";
import te from "./translations/te";
import bn from "./translations/bn";
import mr from "./translations/mr";
import type { TranslationKeys } from "./translations/en";

export type LanguageCode = "en" | "hi" | "ta" | "te" | "bn" | "mr";

export const languages: Record<LanguageCode, { name: string; native: string; flag: string }> = {
  en: { name: "English", native: "English", flag: "🇬🇧" },
  hi: { name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  ta: { name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  te: { name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  bn: { name: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  mr: { name: "Marathi", native: "मराठी", flag: "🇮🇳" },
};

export const translations: Record<LanguageCode, TranslationKeys> = {
  en,
  hi,
  ta,
  te,
  bn,
  mr,
};

export type { TranslationKeys };
