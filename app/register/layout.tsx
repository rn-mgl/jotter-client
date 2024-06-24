import Logo from "@/src/components/global/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Logo />
      {children}
    </>
  );
}
