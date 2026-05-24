import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DocumentLocale } from "@/components/document-locale";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { getCmsContent } from "@/lib/cms-content";
import {
  defaultLocale,
  isLocale,
  localeLabels,
  supportedLocales,
  type Locale,
} from "@/lib/locale";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isLocale(locale) ? locale : defaultLocale;
  const copy = getCmsContent(activeLocale);

  return {
    title: `${copy.brand} | ${copy.pageTitle}`,
    description: copy.pageDescription,
  };
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{detail}</p>
    </div>
  );
}

export default async function LocaleHome({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCmsContent(locale);
  const otherLocale = locale === "en" ? "uk" : "en";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DocumentLocale locale={locale as Locale} />
      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-[color:var(--surface)] px-5 py-4 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-teal-300 to-amber-300 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/20">
              NS
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.36em] text-cyan-200/80">{copy.brand}</p>
              <p className="mt-1 text-sm text-slate-300">{copy.tagline}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
              {copy.nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-white/10 px-3 py-2 transition hover:border-cyan-300/40 hover:bg-white/6 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <LocaleSwitcher currentLocale={locale} />
          </div>
        </header>

        <section id="overview" className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[color:var(--surface-strong)] p-6 shadow-[0_30px_100px_rgba(2,6,23,0.5)] sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,231,219,0.18),transparent_25%),radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.16),transparent_20%)]" />
            <div className="relative max-w-3xl">
              <p className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">
                {copy.tagline}
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {copy.pageTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                {copy.pageDescription}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#schema"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] hover:bg-cyan-100"
                >
                  {copy.primaryAction}
                </Link>
                <Link
                  href={`/${otherLocale}`}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-5 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10"
                >
                  {copy.secondaryAction}
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {copy.metrics.map((metric) => (
                  <StatCard key={metric.label} {...metric} />
                ))}
              </div>
            </div>
          </div>

          <aside className="grid gap-6 rounded-[2.25rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.34)] backdrop-blur-xl sm:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{copy.localizationTitle}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{copy.localizationDescription}</p>
            </div>

            <div className="grid gap-3">
              {copy.localizationPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[1.5rem] border border-white/10 bg-[color:var(--surface)] p-4 text-sm leading-6 text-slate-300"
                >
                  {point}
                </div>
              ))}
            </div>

            <div className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/6 p-5 text-sm leading-6 text-cyan-50">
              <p className="font-semibold text-white">{copy.footerNote}</p>
              <p className="mt-3 text-slate-300">
                {localeLabels[locale]} edition with route-based language support.
              </p>
            </div>
          </aside>
        </section>

        <section id="schema" className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.32)] backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/80">{copy.schemaTitle}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">{copy.schemaDescription}</h2>
            <div className="mt-8 grid gap-4">
              {copy.contentBlocks.map((block) => (
                <div
                  key={block.title}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-300/35 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-white">{block.title}</h3>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
                      Ready
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{block.detail}</p>
                  <p
                    className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-500"
                    style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
                  >
                    {block.meta}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[color:var(--surface-strong)] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.34)] backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{copy.workflowTitle}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{copy.workflowDescription}</p>

            <div className="mt-8 grid gap-4">
              {copy.workflowSteps.map((step) => (
                <div
                  key={step.step}
                  className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 md:grid-cols-[auto_1fr]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-950">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="operations" className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-[color:var(--surface)] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.32)] backdrop-blur-xl sm:p-8">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{copy.queueTitle}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{copy.queueDescription}</p>

            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10">
              {copy.queueItems.map((item, index) => (
                <div
                  key={item.title}
                  className={`grid gap-4 px-5 py-4 md:grid-cols-[1.3fr_0.7fr_0.6fr_0.7fr] ${
                    index !== copy.queueItems.length - 1 ? "border-b border-white/8" : ""
                  }`}
                >
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.locale}</p>
                  </div>
                  <p className="text-sm text-slate-300 md:text-right">{item.owner}</p>
                  <p className="text-sm text-slate-300 md:text-right">{item.status}</p>
                  <div className="flex md:justify-end">
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-cyan-100">
                      Live
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="grid gap-6">
            <div id="localization" className="rounded-[2rem] border border-white/10 bg-[color:var(--surface-strong)] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.32)] backdrop-blur-xl sm:p-8">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{copy.localizationTitle}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{copy.localizationDescription}</p>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-300">
                {copy.localizationPoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.32)] backdrop-blur-xl sm:p-8">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{copy.signalsTitle}</p>
              <div className="mt-6 grid gap-4">
                {copy.signals.map((signal) => (
                  <div
                    key={signal.label}
                    className="rounded-[1.5rem] border border-white/10 bg-[color:var(--surface)] p-5"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-sm font-medium text-slate-300">{signal.label}</p>
                      <p className="text-2xl font-semibold text-white">{signal.value}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{signal.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}