import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "@/components/Providers";
import AmbientGlow from "@/components/AmbientGlow";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rohit Poudel — Full-Stack & AI Developer",
  description:
    "Full-stack developer from Kathmandu building AI-backed products for real problems in Nepal — civic complaint routing, earthquake risk modeling, and voice-first marketplaces.",
  openGraph: {
    title: "Rohit Poudel — Full-Stack & AI Developer",
    description:
      "Full-stack developer from Kathmandu building AI-backed products for real problems in Nepal.",
    type: "website",
  },
};

const themeInit = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
    >
      <head suppressHydrationWarning>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInit }}
        />
      </head>
      <body className="font-body bg-bg text-fg">
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <Providers>
          <AmbientGlow />
          <div className="plus-grid" aria-hidden="true" />
          <div className="grain-overlay" aria-hidden="true" />
          <div className="relative z-10">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
