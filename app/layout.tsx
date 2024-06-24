import type { Metadata } from "next";
import { Poppins, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context";

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

export const metadata: Metadata = {
  title: "Jotter",
  description: "Another note taking app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppProvider>
        <body
          className={`${cormorant.variable} ${poppins.variable} scroll-smooth bg-primary`}
        >
          {children}
        </body>
      </AppProvider>
    </html>
  );
}
