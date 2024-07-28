import Logo from "@/src/components/global/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jotter | Forgot Password",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-4 t:p-10">
      <Logo /> {children}
    </div>
  );
}
