"use client";

import axios from "axios";

import Image from "next/image";
import React, { Suspense } from "react";
import sending from "@/public/global/sending.svg";
import { useSearchParams } from "next/navigation";
import { getCSRFToken } from "@/src/utils/token";

const Message = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  const params = useSearchParams();
  const type = params?.get("type");

  const message = {
    verification: "We are currently sending your verification mail.",
    reset: "We are currently sending your reset link.",
  };

  const handleResendEmail = async () => {
    try {
      const token = await getCSRFToken();

      if (token.csrf_token) {
        const { data: resend } = await axios.post(
          `${url}/email/verification-notification`,
          {},
          {
            headers: { "X-CSRF-TOKEN": token.csrf_token },
            withCredentials: true,
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <p className="font-cormorant text-lg font-bold text-complementary text-center">
        {message[type as keyof object]
          ? message[type as keyof object]
          : "We are currently sending your email."}
      </p>

      {type === "verification" ? (
        <button
          className="w-full bg-accent text-primary p-2 font-bold font-poppins hover:shadow-[0.3rem_0.3rem_#37291c]
          transition-all text-center t:w-fit t:px-4"
          onClick={handleResendEmail}
        >
          Resend
        </button>
      ) : null}
    </>
  );
};

const Sending = () => {
  return (
    <div className="custom-grid-lines w-full h-full min-h-screen flex flex-col items-center justify-center p-4 pb-0 t:p-10 t:pb-0">
      <div className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-ls) gap-6">
        <Image
          src={sending}
          alt="sending"
          className="w-full t:w-80 animate-float drop-shadow-[0.2rem_0.2rem_0.2rem_#A67C58]"
        />
        <Suspense>
          <Message />
        </Suspense>
      </div>
    </div>
  );
};

export default Sending;
