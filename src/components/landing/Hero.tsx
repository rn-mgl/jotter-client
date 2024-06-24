import Image from "next/image";
import React from "react";
import hero from "@/public/landing/hero.svg";
import scribble from "@/public/landing/scribble.svg";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="custom-grid-lines w-full h-full min-h-screen flex flex-col items-center justify-center p-4 pb-0 t:p-10 t:pb-0">
      <div className="w-full h-full flex flex-col items-center justify-start max-w-screen-ls gap-6 mt-auto">
        <div
          className="w-full flex flex-col gap-2 items-center justify-center t:gap-6 
                    h-full mt-auto"
        >
          <div className="flex flex-col items-start justify-center z-10">
            <p className="font-cormorant text-6xl t:text-8xl">Jotter</p>
            <div className="flex flex-row flex-nowrap w-full items-center justify-center gap-2">
              <p className="font-poppins font-light t:text-xl text-nowrap">
                Take notes
              </p>
              <Image src={scribble} alt="scribble" className="w-20 mb-2" />
            </div>
          </div>

          <div className="flex flex-col z-10 gap-2 font-poppins w-full items-center justify-center">
            <Link
              href="/register"
              className="bg-accent w-full text-primary p-2 font-bold t:w-40 
                    border-[0.5px] border-accent hover:shadow-[0.3rem_0.3rem_#37291c]
                    transition-all text-center"
            >
              Start Now
            </Link>
            <Link
              href="/login"
              className="font-bold w-full bg-primary text-complementary p-2 t:w-40 
                    border-[0.5px] border-complementary z-10 hover:shadow-[0.3rem_0.3rem_#0D0D0D]
                    transition-all text-center"
            >
              Log In
            </Link>
          </div>
        </div>

        <Image src={hero} alt="hero" className="w-80 bottom-0 t:w-96" />
      </div>
    </div>
  );
};

export default Hero;
