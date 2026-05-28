"use client";

import Link from "next/link";
import { LocaleSwitcher } from "./locale-switcher";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
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
  const { user, logout, isLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2v-5a2 2 0 012 2h2.972a2 2 0 012 2v5a2 2 0 01-2 2z" />
            </svg>
            News
          </Link>
          {user && (
            <Link
              href={`/${currentLocale}/editor`}
              className="px-3 py-2 text-sm text-slate-300 transition hover:text-white rounded-md hover:bg-slate-800/50 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editor
            </Link>
          )}
          {user?.is_admin && (
            <Link
              href={`/${currentLocale}/admin`}
              className="px-3 py-2 text-sm text-slate-300 transition hover:text-white rounded-md hover:bg-slate-800/50 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Admin
            </Link>
          )}
        </nav>

        {/* User menu & Auth buttons */}
        <div className="flex items-center gap-3">
          {!isLoading && (
            <div className="hidden sm:flex items-center gap-2">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="px-3 py-2 text-sm text-slate-300 transition hover:text-white rounded-md hover:bg-slate-800/50 flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-slate-950">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    {user.username}
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-0 w-48 bg-slate-900 border border-slate-800/50 rounded-lg shadow-xl z-50">
                      <div className="px-4 py-3 border-b border-slate-800/50 text-sm text-slate-300">
                        {user.username}
                        {user.is_admin && (
                          <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Admin</span>
                        )}
                      </div>
                      <Link
                        href={`/${currentLocale}/editor`}
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Articles
                      </Link>
                      {user.is_admin && (
                        <Link
                          href={`/${currentLocale}/admin`}
                          className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 border-t border-slate-800/50"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href={`/${currentLocale}/auth/login`}
                    className="px-3 py-2 text-sm text-slate-300 transition hover:text-white rounded-md hover:bg-slate-800/50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href={`/${currentLocale}/auth/register`}
                    className="px-3 py-2 text-sm rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
          <LocaleSwitcher currentLocale={currentLocale} />
        </div>
      </div>
    </header>
  );
}
