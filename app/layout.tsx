"use client";

import { SessionProvider } from "next-auth/react";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "auto",
  subsets: ["latin"],
  variable: "--font-poppins",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  display: "auto",
  subsets: ["latin"],
  variable: "--font-cormorant",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body
          className={`${cormorant.variable} ${poppins.variable} scroll-smooth bg-primary`}
        >
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
