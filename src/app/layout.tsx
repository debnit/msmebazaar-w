
// This is the root layout that will be used for all pages.
// Since we have a dynamic segment [lang] for localization,
// the actual layout logic is in app/[lang]/layout.tsx.
// This file is still required by Next.js.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
