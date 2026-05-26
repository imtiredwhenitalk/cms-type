import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocumentLocale } from "@/components/document-locale";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { StatsGrid } from "@/components/stats-grid";
import { FeatureSection } from "@/components/feature-section";
import { ContentShowcase } from "@/components/content-showcase";
import { Footer } from "@/components/footer";
import { getCmsContent } from "@/lib/cms-content";
import {
  defaultLocale,
  isLocale,
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

export default async function LocaleHome({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCmsContent(locale);

  return (
    <>
      <DocumentLocale locale={locale as Locale} />
      <Header currentLocale={locale} nav={copy.nav} brand={copy.brand} />

      <main className="flex flex-col">
        {/* Hero Section */}
        <HeroSection
          tag={copy.tagline}
          title={copy.pageTitle}
          description={copy.pageDescription}
          primaryAction={copy.primaryAction}
          secondaryAction={copy.secondaryAction}
        />

        {/* Stats Section */}
        <StatsGrid stats={copy.metrics} />

        {/* Schema/Content Model Section */}
        <FeatureSection
          section={{
            title: copy.schemaTitle,
            description: copy.schemaDescription,
          }}
          features={copy.contentBlocks.map((block) => ({
            icon: "📋",
            title: block.title,
            detail: block.detail,
          }))}
        />

        {/* Workflow Section */}
        <section className="py-20 sm:py-28 border-t border-slate-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {copy.workflowTitle}
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                {copy.workflowDescription}
              </p>
            </div>

            {/* Workflow steps */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {copy.workflowSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="group rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-6 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 font-bold text-white text-sm">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Queue/Operations Section */}
        <section className="py-20 sm:py-28 border-t border-slate-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {copy.queueTitle}
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                {copy.queueDescription}
              </p>
            </div>

            {/* Queue Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/30 to-slate-950/30 backdrop-blur-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {copy.queueItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`group hover:bg-slate-800/20 transition-colors ${
                        idx !== copy.queueItems.length - 1
                          ? "border-b border-slate-800/30"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">{item.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                          {item.locale}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {item.owner}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/30 px-3 py-1 text-xs font-medium text-green-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Localization & Signals Section */}
        <section className="py-20 sm:py-28 border-t border-slate-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Localization */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {copy.localizationTitle}
                </h2>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  {copy.localizationDescription}
                </p>
                <ul className="space-y-3">
                  {copy.localizationPoints.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 items-start rounded-lg border border-slate-800/50 bg-slate-900/20 p-4 hover:border-blue-500/50 hover:bg-slate-900/40 transition-all"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-blue-400 flex-shrink-0" />
                      <span className="text-slate-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Signals */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {copy.signalsTitle}
                </h2>
                <div className="grid gap-4">
                  {copy.signals.map((signal, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-800/50 bg-gradient-to-br from-slate-900/30 to-slate-950/30 p-4 hover:border-cyan-500/50 transition-all group"
                    >
                      <div className="flex items-baseline justify-between mb-2">
                        <p className="text-sm font-medium text-slate-300">
                          {signal.label}
                        </p>
                        <p className="text-2xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                          {signal.value}
                        </p>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {signal.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer brand={copy.brand} note={copy.footerNote} />
    </>
  );
}