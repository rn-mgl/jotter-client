import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Jotter | Profile",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col items-center justify-start w-full h-full p-4 t:p-10 gap-6">
      {children}
    </div>
  );
}
