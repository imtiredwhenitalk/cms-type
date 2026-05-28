"use client";

import { useState, useEffect } from "react";
import { NewsCard, type NewsItem } from "./news-card";

interface NewsListProps {
  locale: string;
  initialNews?: NewsItem[];
}

export function NewsList({ locale, initialNews = [] }: NewsListProps) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [loading, setLoading] = useState(!initialNews.length);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  useEffect(() => {
    if (initialNews.length) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/news");
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();
        setNews(data.news || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [initialNews.length]);

  // Filter news based on search query
  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort news
  const sortedNews = [...filteredNews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Input */}
        <div className="w-full sm:flex-1 relative">
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-800/50 bg-slate-900/50 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/70 transition-all"
          />
        </div>

        {/* Sort Select */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title")}
          className="px-4 py-2.5 rounded-lg border border-slate-800/50 bg-slate-900/50 text-white focus:outline-none focus:border-blue-500/50 transition-all whitespace-nowrap"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">By Title</option>
        </select>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{sortedNews.length}</strong> of{" "}
          <strong className="text-white">{news.length}</strong> news articles
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-blue-400 hover:text-cyan-400 transition-colors"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="space-y-4 w-full max-w-2xl">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/40 to-slate-950/40 animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
          <p className="font-medium">Error loading news</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && sortedNews.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-slate-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2v-5a2 2 0 012-2h2.972a2 2 0 012 2v5a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-white mb-1">No news found</h3>
          <p className="text-slate-400">
            {searchQuery
              ? "Try adjusting your search query"
              : "No articles available at the moment"}
          </p>
        </div>
      )}

      {/* News Grid */}
      {!loading && !error && sortedNews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNews.map((item) => (
            <NewsCard key={item.id} news={item} locale={locale} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!loading && !error && news.length > 9 && (
        <div className="text-center pt-8">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-950/50 text-white hover:border-blue-500/50 hover:bg-slate-900/60 transition-all"
          >
            <span>Load more articles</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
