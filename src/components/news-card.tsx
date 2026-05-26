"use client";

import { formatDate } from "@/lib/utils";
import Link from "next/link";

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface NewsCardProps {
  news: NewsItem;
  locale: string;
}

export function NewsCard({ news, locale }: NewsCardProps) {
  const excerpt = news.content.substring(0, 150) + (news.content.length > 150 ? "..." : "");
  const date = new Date(news.created_at);
  const isNew = new Date().getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000; // 7 дней

  return (
    <article className="group relative rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/40 to-slate-950/40 p-6 hover:border-blue-500/50 hover:bg-slate-900/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
      {/* New badge */}
      {isNew && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 text-xs font-semibold text-white">
            New
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <time
            dateTime={news.created_at}
            className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            {formatDate(news.created_at)}
          </time>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/50 text-slate-400">
            ID: {news.id}
          </span>
        </div>

        {/* Title */}
        <Link href={`/${locale}/news/${news.id}`}>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer">
            {news.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4 flex-grow">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <span className="text-xs text-slate-400">
              {news.content.length} chars
            </span>
          </div>

          <Link
            href={`/${locale}/news/${news.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-cyan-400 transition-colors"
          >
            Read more
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
