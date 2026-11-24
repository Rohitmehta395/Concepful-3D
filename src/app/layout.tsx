import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Russo_One } from "next/font/google";
import { Footer } from "@/components/shell/Footer";
import { LeadModal, LeadModalProvider } from "@/components/modal";
import { Header } from "@/components/shell/Header";
import { SceneHost } from "@/components/scene/SceneHost";
import { AppModeSync } from "@/components/scene/AppModeSync";
import { ConfiguratorShell } from "@/components/configurator/ConfiguratorShell";
import { ConfiguratorProvider } from "@/components/configurator/ConfiguratorProvider";
import { SkipLink } from "@/components/shell/SkipLink";
import { STORY_SECTIONS } from "@/content";
import "./globals.css";

const russoOne = Russo_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-russo-one",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "monospace"],
});

// Original line 2198: "© 2026 Concepful · Creative Department-as-a-Service"
const [copyrightPrefix, tagline] = STORY_SECTIONS.footer.lines[0].split(" · ");
const brand = copyrightPrefix?.split(" ")[2] ?? "Concepful";
const siteTitle = `${brand} · ${tagline}`;
const siteDescription = STORY_SECTIONS.hero.description;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://concepful.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#141624",
};

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: brand,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${russoOne.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans" suppressHydrationWarning>
        <SceneHost />
        <AppModeSync />
        <SkipLink />
        <LeadModalProvider>
          <ConfiguratorProvider>
            <Header />
            <ConfiguratorShell />
            {children}
          </ConfiguratorProvider>
          <Footer />
          <LeadModal />
        </LeadModalProvider>
      </body>
    </html>
  );
}
