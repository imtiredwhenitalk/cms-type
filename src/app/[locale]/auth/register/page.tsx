import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocumentLocale } from "@/components/document-locale";
import { Header } from "@/components/header";
import { AuthForm } from "@/components/auth-form";
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
    title: `Create Account | ${copy.brand}`,
    description: "Create a new account",
  };
}

export default async function RegisterPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCmsContent(locale);

  return (
    <>
      <DocumentLocale locale={locale as Locale} />
      <Header currentLocale={locale} nav={copy.nav} brand={copy.brand} />

      <main className="flex-1 flex items-center justify-center py-16 sm:py-20">
        <div className="w-full max-w-md px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <a href={`/${locale}`} className="hover:text-slate-300 transition-colors">
              Home
            </a>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">Sign Up</span>
          </div>

          {/* Auth Form */}
          <AuthForm mode="register" />
        </div>
      </main>

      <Footer brand={copy.brand} note={copy.footerNote} />
    </>
  );
}
