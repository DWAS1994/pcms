import "./globals.css";

export const metadata = {
  title: "Universal Guard",
  description: "Production-ready license and admin platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
