import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Russo_One } from "next/font/google";
import { Footer } from "@/components/shell/Footer";
import { GuildModal } from "@/components/shell/GuildModal";
import { Header } from "@/components/shell/Header";
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
});

// Original line 2198: "© 2026 Concepful · Creative Department-as-a-Service"
const [copyrightPrefix, tagline] = STORY_SECTIONS.footer.lines[0].split(" · ");
const brand = copyrightPrefix?.split(" ")[2] ?? "Concepful";
const siteTitle = `${brand} · ${tagline}`;
const siteDescription = STORY_SECTIONS.hero.description;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#141624",
};

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
  openGraph: {
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
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SkipLink />
        <Header />
        {children}
        <Footer />
        <GuildModal />
      </body>
    </html>
  );
}
