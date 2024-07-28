"use client";
import { useGlobalContext } from "@/context";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React from "react";

const Forgot = () => {
  const [registeredEmail, setRegisteredEmail] = React.useState("");

  const { url } = useGlobalContext();
  const router = useRouter();

  const handleRegisteredEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setRegisteredEmail(value);
  };

  const forgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data: token } = await axios.get(`${url}/csrf_token`, {
        withCredentials: true,
      });

      if (token.csrf_token) {
        const { data: valid } = await axios.post(
          `${url}/forgot_password`,
          { registered_email: registeredEmail },
          {
            withCredentials: true,
            headers: {
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
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
      <div className="w-full h-full flex flex-col items-center justify-center max-w-screen-ll">
        <form
          onSubmit={(e) => forgotPassword(e)}
          className="max-w-screen-ml w-full flex flex-col items-start justify-center gap-4"
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
              className="w-full p-2 focus:outline-none focus:border-accent border-2 transition-all text-complementary"
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
