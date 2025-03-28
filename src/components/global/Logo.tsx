import Image from "next/image";
import React from "react";
import logo from "@/public/global/logo.svg";
import Link from "next/link";

interface LogoProps {
  url?: string;
}

const Logo: React.FC<LogoProps> = (props) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col justify-center max-w-(--breakpoint-ll) items-start">
        <Link href={props.url || "/"}>
          <Image
            src={logo}
            alt="logo"
            className="w-7 hover:shadow-[0.2rem_0.2rem_#0D0D0D] transition-all t:w-8"
          />
        </Link>
      </div>
    </div>
  );
};

export default Logo;
