import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import { Montserrat } from 'next/font/google'
import { Michroma } from 'next/font/google'

import PageTransition from "@/components/PageTransitions/PageTransition";
import TransitionOverlay from "@/components/PageTransitions/TransitionOverlay";
import SmoothScroll from "@/components/Lenis";

const michroma = Michroma({
  subsets: ['latin'],
  weight: '400', // Michroma only has 400 (regular)
  variable: '--font-michroma',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: "Ali Does Vfx",
  description: "Learn Creating Stunning Visual Effects",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ cssLayerName: 'clerk', }} >
      <html lang="en">
        <body
          className={`${montserrat.variable} ${michroma.variable}`}
          >
              <TransitionOverlay/>
              <PageTransition>
                <SmoothScroll>
                    {children}
                </SmoothScroll>
              </PageTransition>
        </body>
      </html>
    </ClerkProvider>
  );
}
