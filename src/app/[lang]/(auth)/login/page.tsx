import { LoginForm } from "@/components/auth/LoginForm";
import { getSession } from "@/lib/auth";
import { Locale } from "@/i18n-config";
import { redirect } from "next/navigation";

export default async function LoginPage({ params: { lang } }: { params: { lang: Locale } }) {
  const session = await getSession();
  if (session) {
    redirect(`/${lang}/dashboard`);
  }
  return <LoginForm />;
}
