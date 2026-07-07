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
  title: "Rohit Poudel | Developer & AI Enthusiast",
  description:
    "18-year-old developer and AI enthusiast from Kathmandu, Nepal. Building intelligent applications and exploring emerging tech, learning through self-study, hackathons, and competitions.",
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
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInit }}
        />
      </head>
      <body className="font-body bg-bg text-fg">
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
