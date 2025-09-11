import Logo from "@/components/layout/Logo";
import { Locale } from "@/i18n-config";
import Link from "next/link";

export default function AuthLayout({
  children,
  params: { lang }
}: {
  children: React.ReactNode;
  params: { lang: Locale }
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Link href={`/${lang}`}>
          <Logo />
        </Link>
      </div>
      {children}
    </div>
  );
}
