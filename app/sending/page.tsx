"use client";
import { useGlobalContext } from "@/context";
import axios from "axios";
import { getCookie } from "cookies-next";
import Image from "next/image";
import React, { Suspense } from "react";
import sending from "@/public/global/sending.svg";
import { useSearchParams } from "next/navigation";

interface MessageProps {
  type: string | null;
}

const Message: React.FC<MessageProps> = (props) => {
  const { url } = useGlobalContext();

  const message = {
    verification: "We are currently sending your verification mail.",
  };

  const handleResendEmail = async () => {
    try {
      const { data: token } = await axios.get(`${url}/csrf_token`, {
        withCredentials: true,
      });

      if (token.csrf_token) {
        const { data: resend } = await axios.post(
          `${url}/email/verification-notification`,
          {},
          {
            headers: { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") },
            withCredentials: true,
          }
        );

        console.log(resend);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <p className="font-cormorant text-lg font-bold text-complementary text-center">
        {message[props.type as keyof object]
          ? message[props.type as keyof object]
          : "We are currently sending your email."}
      </p>

      {props.type === "verification" ? (
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
  const params = useSearchParams();

  return (
    <div className="custom-grid-lines w-full h-full min-h-screen flex flex-col items-center justify-center p-4 pb-0 t:p-10 t:pb-0">
      <div className="w-full h-full flex flex-col items-center justify-start max-w-screen-ls gap-6">
        <Image
          src={sending}
          alt="sending"
          className="w-full t:w-80 animate-float drop-shadow-[0.2rem_0.2rem_0.2rem_#A67C58]"
        />
        <Suspense>
          <Message type={params.get("type")} />
        </Suspense>
      </div>
    </div>
  );
};

export default Sending;
