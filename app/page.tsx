import { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import Logo from "@/src/components/global/Logo";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Jotter",
};

export default function Home() {
  return (
    <main className="flex h-full min-h-screen flex-col items-center justify-between bg-primary">
      <Hero />
    </main>
  );
}
