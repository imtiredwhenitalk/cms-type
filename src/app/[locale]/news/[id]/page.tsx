import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { DocumentLocale } from "@/components/document-locale";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getCmsContent } from "@/lib/cms-content";
import {
  defaultLocale,
  isLocale,
  supportedLocales,
  type Locale,
} from "@/lib/locale";
import { formatDate, timeAgo } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

interface NewsDetail {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Revalidate every hour
export const revalidate = 3600;

export function generateStaticParams() {
  // Generate params for locale only - individual articles will be fetched dynamically
  return supportedLocales.map((locale) => ({
    locale,
    id: "1", // Placeholder
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const activeLocale = isLocale(locale) ? locale : defaultLocale;
  const copy = getCmsContent(activeLocale);

  try {
    const response = await fetch(`http://localhost:5000/api/news/${id}`);
    if (!response.ok) throw new Error("Not found");

    const news: NewsDetail = await response.json();

    return {
      title: `${news.title} | ${copy.brand}`,
      description: news.content.substring(0, 160),
    };
  } catch {
    return {
      title: `News | ${copy.brand}`,
      description: "Article not found",
    };
  }
}

async function fetchNews(id: string): Promise<NewsDetail | null> {
  try {
    const response = await fetch(`http://localhost:5000/api/news/${id}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

async function fetchAllNews(): Promise<NewsDetail[]> {
  try {
    const response = await fetch("http://localhost:5000/api/news");
    if (!response.ok) return [];
    const data = await response.json();
    return data.news || [];
  } catch {
    return [];
  }
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { locale, id } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCmsContent(locale);
  const news = await fetchNews(id);

  if (!news) {
    notFound();
  }

  const allNews = await fetchAllNews();
  const relatedNews = allNews
    .filter((item) => item.id !== news.id)
    .slice(0, 3);

  return (
    <>
      <DocumentLocale locale={locale as Locale} />
      <Header currentLocale={locale} nav={copy.nav} brand={copy.brand} />

      <main className="flex flex-col flex-1">
        {/* Article Header */}
        <article className="flex-1">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="py-6 flex items-center gap-2 text-sm text-slate-400 border-b border-slate-800/50">
              <Link href={`/${locale}`} className="hover:text-slate-300 transition-colors">
                Home
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href={`/${locale}/news`} className="hover:text-slate-300 transition-colors">
                News
              </Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white font-medium truncate">{news.title}</span>
            </div>

            {/* Article Content */}
            <div className="py-12 sm:py-16">
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {news.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 pb-8 border-b border-slate-800/50 mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                  </svg>
                  <time dateTime={news.created_at}>
                    {formatDate(news.created_at)}
                  </time>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                  </svg>
                  <span>{news.content.length} characters</span>
                </div>

                {news.updated_at !== news.created_at && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.414 7.414 1 1 0 11-1.414-1.414A5.002 5.002 0 1016.101 8H18a1 1 0 010 2h-4a1 1 0 01-1-1V3a1 1 0 011-1h2z" clipRule="evenodd" />
                    </svg>
                    <span>Updated {timeAgo(news.updated_at)}</span>
                  </div>
                )}
              </div>

              {/* Article Body */}
              <div className="prose prose-invert max-w-none">
                <div className="text-lg leading-relaxed text-slate-300 space-y-4">
                  {news.content.split("\n").map((paragraph, idx) => (
                    <p key={idx} className={paragraph ? "" : "h-4"}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-slate-800/50">
                <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wide">
                  Share this article
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      navigator.share?.({
                        title: news.title,
                        text: news.content.substring(0, 100),
                        url: window.location.href,
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-800/50 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 11-6 0 3 3 0 016 0zM6.5 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedNews.length > 0 && (
          <section className="border-t border-slate-800/50 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 py-16 sm:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
                Related Articles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}/news/${item.id}`}
                    className="group rounded-xl border border-slate-800/50 bg-slate-900/40 p-6 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all"
                  >
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                      {item.content.substring(0, 100)}...
                    </p>
                    <time className="text-xs text-slate-500">
                      {formatDate(item.created_at)}
                    </time>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  href={`/${locale}/news`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-800/50 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 transition-colors"
                >
                  Back to all news
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
