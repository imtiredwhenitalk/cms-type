import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
import { AdminPanel } from "@/components/admin-panel";

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
    title: `Admin Panel | ${copy.brand}`,
    description: "Manage users and content",
  };
}

export default async function AdminPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const copy = getCmsContent(locale);

  return (
    <>
      <DocumentLocale locale={locale as Locale} />
      <Header currentLocale={locale} nav={copy.nav} brand={copy.brand} />

      <main className="flex-1 flex flex-col">
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AdminPanel locale={locale} />
          </div>
        </section>
      </main>

      <Footer brand={copy.brand} note={copy.footerNote} />
    </>
  );
}
