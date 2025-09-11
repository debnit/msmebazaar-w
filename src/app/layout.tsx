
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'MSMEConnect',
  description: 'Financial services for Micro, Small, and Medium Enterprises',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en" suppressHydrationWarning={true}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        </head>
      <body>
        <div className="relative flex min-h-screen flex-col">
          <Header session={session} />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
          <Toaster />
        </div>
      </body>
    </html>
  );
}
