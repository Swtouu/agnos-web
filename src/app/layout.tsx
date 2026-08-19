import type { Metadata } from "next";
import { Athiti, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { Header } from "@/components/layout/Header";

// Athiti — matches Agnos's own brand font choice (agnoshealth.com), and handles
// Thai glyphs properly, which the previous Geist Sans stack did not.
const athiti = Athiti({
  variable: "--font-athiti",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agnos Patient Intake",
  description: "Real-time patient intake form and staff monitoring dashboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${athiti.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LocaleProvider>
            <Header />
            <div className="flex flex-1 flex-col">{children}</div>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
