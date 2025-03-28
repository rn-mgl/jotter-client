"use client";
import { useGlobalContext } from "@/context";
import Logo from "@/src/components/global/Logo";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";

interface UserProps {
  image: string | null;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [activeMoreActions, setActiveMoreActions] = React.useState(false);
  const [user, setUser] = React.useState<UserProps>();
  const { url } = useGlobalContext();
  const router = useRouter();
  const path = usePathname();

  const handleActiveMoreActions = () => {
    setActiveMoreActions((prev) => !prev);
  };

  const logout = async () => {
    try {
      const token = await getCSRFToken();

      if (token.csrf_token) {
        const { data: logout } = await axios.delete(`${url}/logout`, {
          headers: { "X-CSRF-TOKEN": token.csrf_token },
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

  const getUser = React.useCallback(async () => {
    try {
      const { data: user } = await axios.get(`${url}/profile`, {
        withCredentials: true,
      });

      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url]);

  React.useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen h-full p-4 t:p-10 gap-6">
      <div className="w-full flex flex-row items-center justify-between">
        <Logo url="/jotter" />

        <div className="flex flex-row gap-2 items-center justify-center">
          <Link
            style={{ backgroundImage: user?.image ? `url(${user.image})` : "" }}
            href={`/jotter/profile`}
            title="Profile"
            className={`w-8 h-8 min-w-8 min-h-8 bg-accent t:w-10 t:h-10 t:min-w-10 t:min-h-10 bg-center bg-cover
                      ${
                        path === "/jotter/profile" &&
                        "shadow-[0.2rem_0.2rem_#0D0D0D] transition-all"
                      }`}
          ></Link>

          <div className="flex flex-col items-center justify-center relative">
            <button
              onClick={handleActiveMoreActions}
              className={`p-1 h-fit text-complementary text-xl hover:shadow-[0.2rem_0.2rem_#0D0D0D] 
                        transition-all border-[1px] border-complementary
                          ${
                            activeMoreActions && "bg-complementary text-primary"
                          }`}
            >
              <BiChevronDown />
            </button>

            {activeMoreActions ? (
              <div
                className=" bg-primary border-accent flex flex-col w-40 gap-2 font-poppins text-sm
                        text-accent shadow-md animate-fadeIn absolute right-0 -bottom-14 z-10"
              >
                <button
                  className="border-accent border-[1px] p-2 hover:shadow-[0.2rem_0.2rem_#A67C58] 
                            transition-all flex flex-row items-center justify-between"
                  onClick={logout}
                >
                  Log Out <AiOutlineLogout />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
