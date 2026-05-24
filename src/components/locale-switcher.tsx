import Link from "next/link";

import { localeLabels, supportedLocales, type Locale } from "@/lib/locale";

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  return (
    <div className="inline-flex rounded-full border border-white/12 bg-white/8 p-1 shadow-[0_12px_50px_rgba(2,6,23,0.32)] backdrop-blur-xl">
      {supportedLocales.map((locale) => {
        const active = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={`/${locale}`}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] transition ${
              active
                ? "bg-white text-slate-950 shadow-lg shadow-cyan-400/20"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{locale.toUpperCase()}</span>
              <span className="hidden sm:inline">{localeLabels[locale]}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}