import Logo from "@/src/components/global/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jotter",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-4 t:p-10 gap-6">
      <div className="w-full flex flex-row items-center justify-between">
        <Logo url="/jotter" />
        <button
          title="Profile"
          className="w-8 h-8 min-w-8 min-h-8 bg-accent rounded-full t:w-10 t:h-10 t:min-w-10 t:min-h-10"
        ></button>
      </div>

      {children}
    </div>
  );
}
