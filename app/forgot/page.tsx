"use client";

import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useRouter } from "next/navigation";
import React from "react";

const Forgot = () => {
  const [registeredEmail, setRegisteredEmail] = React.useState("");

  const url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const handleRegisteredEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setRegisteredEmail(value);
  };

  const forgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = await getCSRFToken();

      if (token.csrf_token) {
        const { data: valid } = await axios.post(
          `${url}/forgot_password`,
          { registered_email: registeredEmail },
          {
            withCredentials: true,
            headers: {
              "X-CSRF-TOKEN": token.csrf_token,
            },
          }
        );

        if (valid.status) {
          router.push("/sending?type=reset");
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
          onSubmit={(e) => forgotPassword(e)}
          className="max-w-(--breakpoint-ml) w-full flex flex-col items-start justify-center gap-4"
        >
          <div className="w-full flex flex-col items-start justify-center">
            <p className="font-black font-cormorant text-3xl t:text-5xl">
              Forgot Password
            </p>
            <p className="font-poppins text-sm font-light t:text-base">
              Enter your registered email
            </p>
          </div>

          <div className="flex flex-col w-full gap-2 items-center justify-center font-poppins text-sm">
            <input
              type="email"
              className="w-full p-2 focus:outline-hidden focus:border-accent border-2 transition-all text-complementary"
              placeholder="Email"
              name="email"
              onChange={(e) => handleRegisteredEmail(e)}
              value={registeredEmail}
            />
          </div>

          <button
            className=" w-full p-2 bg-complementary text-primary font-bold font-poppins hover:shadow-[0.3rem_0.3rem_#A67C58]
                transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgot;
