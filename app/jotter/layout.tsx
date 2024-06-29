"use client";
import { useGlobalContext } from "@/context";
import Logo from "@/src/components/global/Logo";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { url } = useGlobalContext();
  const router = useRouter();

  const logout = async () => {
    try {
      const { data: token } = await axios.get(`${url}/csrf_token`, {
        withCredentials: true,
      });

      if (token.csrf_token) {
        const { data: logout } = await axios.delete(`${url}/logout`, {
          headers: { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") },
          withCredentials: true,
        });

        if (logout.success) {
          router.push("/");
          deleteCookie("jotter");
          deleteCookie("jotter_session");
          deleteCookie("XSRF-TOKEN");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen h-full p-4 t:p-10 gap-6">
      <div className="w-full flex flex-row items-center justify-between">
        <Logo url="/jotter" />
        <button
          onClick={logout}
          title="Profile"
          className="w-8 h-8 min-w-8 min-h-8 bg-accent rounded-full t:w-10 t:h-10 t:min-w-10 t:min-h-10"
        ></button>
      </div>

      {children}
    </div>
  );
}
