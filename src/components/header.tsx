"use client";

import Link from "next/link";
import { LocaleSwitcher } from "./locale-switcher";
import type { Locale } from "@/lib/locale";

type NavItem = {
  label: string;
  href: string;
};

interface HeaderProps {
  currentLocale: Locale;
  nav: NavItem[];
  brand: string;
}

export function Header({ currentLocale, nav, brand }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/50 bg-gradient-to-b from-slate-950/95 to-slate-950/75 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${currentLocale}`} className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 font-semibold text-slate-950 shadow-lg transition-all group-hover:shadow-blue-500/25">
            ★
          </div>
          <span className="hidden font-semibold text-white sm:inline text-sm">{brand}</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3 py-2 text-sm text-slate-300 transition hover:text-white rounded-md hover:bg-slate-800/50"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={`/${currentLocale}/news`}
            className="px-3 py-2 text-sm text-slate-300 transition hover:text-white rounded-md hover:bg-slate-800/50 ml-2 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2v-5a2 2 0 012-2h2.972a2 2 0 012 2v5a2 2 0 01-2 2z" />
            </svg>
            News
          </Link>
        </nav>

        {/* Locale switcher */}
        <div>
          <LocaleSwitcher currentLocale={currentLocale} />
        </div>
      </div>
    </header>
  );
}
