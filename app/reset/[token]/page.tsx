"use client";

import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useParams, useRouter } from "next/navigation";
import React from "react";

const ResetPassword = () => {
  const [resetData, setResetData] = React.useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const params = useParams();
  const passwordToken = params?.token;
  const url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const handleResetData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setResetData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = await getCSRFToken();

      if (token.csrf_token) {
        const { data: reset } = await axios.post(
          `${url}/reset_password`,
          { ...resetData, token: passwordToken },
          {
            withCredentials: true,
            headers: { "X-CSRF-TOKEN": token.csrf_token },
          }
        );

        if (reset.status) {
          router.push("/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-ll)">
        <form
          onSubmit={(e) => resetPassword(e)}
          className="max-w-(--breakpoint-ml) w-full flex flex-col items-start justify-center gap-4"
        >
          <div className="w-full flex flex-col items-start justify-center">
            <p className="font-black font-cormorant text-3xl t:text-5xl">
              Reset Password
            </p>
            <p className="font-poppins text-sm font-light t:text-base">
              Enter your new password
            </p>
          </div>

          <div className="flex flex-col w-full gap-2 items-center justify-center font-poppins text-sm">
            <input
              type="email"
              className="w-full p-2 focus:outline-hidden focus:border-accent border-2 transition-all text-complementary"
              placeholder="Email"
              name="email"
              onChange={(e) => handleResetData(e)}
              value={resetData.email}
            />

            <input
              type="password"
              className="w-full p-2 focus:outline-hidden focus:border-accent border-2 transition-all text-complementary"
              placeholder="Password"
              name="password"
              onChange={(e) => handleResetData(e)}
              value={resetData.password}
            />

            <input
              type="password"
              className="w-full p-2 focus:outline-hidden focus:border-accent border-2 transition-all text-complementary"
              placeholder="Confirm Password"
              name="password_confirmation"
              onChange={(e) => handleResetData(e)}
              value={resetData.password_confirmation}
            />
          </div>

          <button
            className=" w-full p-2 bg-complementary text-primary font-bold font-poppins hover:shadow-[0.3rem_0.3rem_#A67C58]
            transition-all"
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
