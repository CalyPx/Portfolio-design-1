import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "@/components/Providers";

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
  title: "Rohit Poudel — AI/ML Full-Stack Builder",
  description:
    "18-year-old AI/ML-focused full-stack builder from Kathmandu, Nepal. Team lead of VagaBond. I design & build AI-integrated products that ship in Nepal and scale for research.",
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
          <div className="plus-grid" aria-hidden="true" />
          <div className="relative z-10">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
