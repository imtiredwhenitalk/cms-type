import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocumentLocale } from "@/components/document-locale";
import { Header } from "@/components/header";
import { NewsList } from "@/components/news-list";
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
    title: `News | ${copy.brand}`,
    description: "Latest news and articles from our CMS.",
  };
}

export default async function NewsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCmsContent(locale);

  return (
    <>
      <DocumentLocale locale={locale as Locale} />
      <Header currentLocale={locale} nav={copy.nav} brand={copy.brand} />

      <main className="flex flex-col flex-1">
        {/* Hero Section for News */}
        <section className="relative py-16 sm:py-20 lg:py-24 border-b border-slate-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <a href={`/${locale}`} className="hover:text-slate-300 transition-colors">
                  Home
                </a>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-white font-medium">News</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Latest News & Updates
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8">
                Stay informed with our latest articles, updates, and announcements. 
                Discover insights about our platform, features, and community.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 sm:gap-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Latest Content</p>
                    <p className="text-xl font-bold text-white">Updated Daily</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Community Driven</p>
                    <p className="text-xl font-bold text-white">For Everyone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
        </section>

        {/* News Content Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <NewsList locale={locale} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 border-t border-slate-800/50 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Subscribe to our newsletter to receive the latest news and updates directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-slate-800/50 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 transition-all"
              />
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
