
import type { Metadata } from 'next';
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { getSession } from '@/lib/auth';
import { i18n, Locale } from '@/i18n-config';

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }));
}

export const metadata: Metadata = {
  title: 'MSMEConnect',
  description: 'Financial services for Micro, Small, and Medium Enterprises',
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const session = await getSession();
  return (
      <div className="relative flex min-h-screen flex-col">
        <Header session={session} lang={params.lang} />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster />
      </div>
  );
}
