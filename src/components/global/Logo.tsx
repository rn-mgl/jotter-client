import Image from "next/image";
import React from "react";
import logo from "@/public/global/logo.svg";
import Link from "next/link";

interface LogoProps {
  url?: string;
}

const Logo: React.FC<LogoProps> = (props) => {
  return (
    <div className="absolute w-full flex flex-col items-center">
      <div className="w-full flex flex-col items-center justify-center p-2 max-w-screen-ls t:p-6 t:items-start">
        <Link href={props.url || "/"}>
          <Image
            src={logo}
            alt="logo"
            className="w-8 hover:shadow-lg transition-all"
          />
        </Link>
      </div>
    </div>
  );
};

export default Logo;
