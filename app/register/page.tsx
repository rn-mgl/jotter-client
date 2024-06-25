"use client";

import { useGlobalContext } from "@/context";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React from "react";

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const Register = () => {
  const [registerData, setRegisterData] = React.useState<RegisterData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const { url } = useGlobalContext();
  const router = useRouter();

  const handleRegisterData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setRegisterData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data: token } = await axios.get(`${url}/csrf_token`, {
        withCredentials: true,
      });

      if (token.csrf_token) {
        const { data: register } = await axios.post(
          `${url}/register`,
          {
            ...registerData,
          },
          {
            headers: { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") },
            withCredentials: true,
          }
        );

        if (register.success) {
          router.push("/sending?type=verification");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full flex flex-col items-center justify-center max-w-screen-ls">
        <form
          onSubmit={(e) => handleSubmitRegister(e)}
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
              type="text"
              className="w-full p-2 focus:outline-none focus:border-accent border-2 transition-all text-complementary"
              placeholder="First Name"
              name="first_name"
              value={registerData.first_name}
              onChange={(e) => handleRegisterData(e)}
            />

            <input
              type="text"
              className="w-full p-2 focus:outline-none focus:border-accent border-2 transition-all text-complementary"
              placeholder="Last Name"
              name="last_name"
              value={registerData.last_name}
              onChange={(e) => handleRegisterData(e)}
            />

            <input
              type="email"
              className="w-full p-2 focus:outline-none focus:border-accent border-2 transition-all text-complementary"
              placeholder="Email"
              name="email"
              value={registerData.email}
              onChange={(e) => handleRegisterData(e)}
            />

            <input
              type="password"
              className="w-full p-2 focus:outline-none focus:border-accent border-2 transition-all text-complementary"
              placeholder="Password"
              name="password"
              value={registerData.password}
              onChange={(e) => handleRegisterData(e)}
            />

            <input
              type="password"
              className="w-full p-2 focus:outline-none focus:border-accent border-2 transition-all text-complementary"
              placeholder="Confirm Password"
              name="password_confirmation"
              value={registerData.password_confirmation}
              onChange={(e) => handleRegisterData(e)}
            />
          </div>

          <button
            className=" w-full p-2 bg-complementary text-primary font-bold font-poppins hover:shadow-[0.3rem_0.3rem_#A67C58]
                    transition-all"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
