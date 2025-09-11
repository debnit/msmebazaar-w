
// This is the root layout that will be used for all pages.
// It must contain <html> and <body> tags.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
