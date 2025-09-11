
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

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const session = await getSession();
  return (
    <html lang={params.lang} suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header session={session} lang={params.lang} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <WhatsAppButton />
        <Toaster />
      </body>
    </html>
  );
}
