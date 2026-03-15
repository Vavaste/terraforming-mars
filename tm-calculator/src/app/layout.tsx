import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TM Calculator - Terraforming Mars Card Value Calculator",
  description: "Calculate the real value of Terraforming Mars cards based on game length and resource conversion rates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
