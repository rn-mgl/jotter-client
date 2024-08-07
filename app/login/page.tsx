"use client";

import React from "react";
import axios from "axios";
import { useGlobalContext } from "@/context";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginData {
  email: string;
  password: string;
}

const Login = () => {
  const [loginData, setLoginData] = React.useState<LoginData>({
    email: "",
    password: "",
  });

  const { url } = useGlobalContext();
  const router = useRouter();

  const handleLoginData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setLoginData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data: token } = await axios.get(`${url}/csrf_token`, {
        withCredentials: true,
      });

      if (token.csrf_token) {
        const { data: login } = await axios.post(
          `${url}/login`,
          {
            ...loginData,
          },
          {
            headers: { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") },
            withCredentials: true,
          }
        );

        if (login.success) {
          if (login.isVerified) {
            setCookie("jotter", login.user, {
              sameSite: "lax",
            });
            router.push("/jotter");
          } else {
            router.push("/sending?type=verification");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full h-full flex flex-col items-center justify-center max-w-screen-ll">
        <form
          onSubmit={(e) => handleSubmitLogin(e)}
          className="max-w-screen-ml w-full flex flex-col items-start justify-center gap-4"
        >
          <div className="w-full flex flex-col items-start justify-center">
            <p className="font-black font-cormorant text-3xl t:text-5xl">
              Capture Ideas Instantly
            </p>
            <p className="font-poppins text-sm font-light t:text-base">
              Organize Your Thoughts Effortlessly
            </p>
          </div>

          <div className="flex flex-col w-full gap-2 items-center justify-center font-poppins text-sm">
            <input
              type="email"
              className="w-full p-2 focus:outline-none focus:border-accent border-2 transition-all text-complementary"
              placeholder="Email"
              name="email"
              value={loginData.email}
              onChange={(e) => handleLoginData(e)}
            />

            <input
              type="password"
              className="w-full p-2 focus:outline-none focus:border-accent border-2 transition-all text-complementary"
              placeholder="Password"
              name="password"
              value={loginData.password}
              onChange={(e) => handleLoginData(e)}
            />

            <Link
              href="/forgot"
              className="mr-auto text-accent hover:underline hover:underline-offset-2"
            >
              Forgot Password
            </Link>
          </div>

          <button
            className=" w-full p-2 bg-complementary text-primary font-bold font-poppins hover:shadow-[0.3rem_0.3rem_#A67C58]
                    transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
