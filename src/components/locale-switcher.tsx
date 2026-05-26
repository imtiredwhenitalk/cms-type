import Link from "next/link";

import { localeLabels, supportedLocales, type Locale } from "@/lib/locale";

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  return (
    <div className="inline-flex rounded-lg border border-slate-700/50 bg-slate-800/30 p-1 backdrop-blur-sm">
      {supportedLocales.map((locale) => {
        const active = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={`/${locale}`}
            aria-current={active ? "page" : undefined}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
              active
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}