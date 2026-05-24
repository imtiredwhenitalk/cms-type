export const supportedLocales = ["en", "uk"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  uk: "Українська",
};

const localeAliases: Record<string, Locale> = {
  en: "en",
  "en-us": "en",
  "en-gb": "en",
  uk: "uk",
  "uk-ua": "uk",
  ua: "uk",
};

export function isLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function normalizeLocale(value?: string | null): Locale {
  if (!value) {
    return defaultLocale;
  }

  const directMatch = localeAliases[value.toLowerCase()];
  if (directMatch) {
    return directMatch;
  }

  const baseLanguage = value.toLowerCase().split("-")[0];
  return localeAliases[baseLanguage] ?? defaultLocale;
}

export function detectLocaleFromAcceptLanguage(
  header?: string | null,
): Locale {
  if (!header) {
    return defaultLocale;
  }

  const parsed = header
    .split(",")
    .map((segment) => {
      const [tag, ...params] = segment.trim().split(";");
      const quality = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));
      const qValue = quality ? Number.parseFloat(quality.slice(2)) : 1;

      return {
        tag: tag.toLowerCase(),
        q: Number.isFinite(qValue) ? qValue : 0,
      };
    })
    .sort((left, right) => right.q - left.q);

  for (const item of parsed) {
    const normalized = normalizeLocale(item.tag);
    if (normalized) {
      return normalized;
    }
  }

  return defaultLocale;
}