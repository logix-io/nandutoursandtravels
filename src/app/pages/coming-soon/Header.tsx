import Image from "next/image";
import logo from "@/assets/innova_no_bg.webp";
import React from "react";

const Header = () => {
  return (
    <div className="header flex flex-col items-center p-2">
      <Image
        src={logo}
        alt="logo"
        width={400}
        height={200}
        className="rounded-full"
      />
      <div className="flex items-baseline gap-1">
        <h1 className="text-6xl font-bold">Nandu Tours And Travels</h1>
        <div className="text-sky-600 text-5xl rounded-full w-2 h-2 border-2 border-sky-600 bg-sky-600"></div>
      </div>
      <h2 className="heading font-light">
        We are Launching <span className="font-bold">soon!</span>
      </h2>
    </div>
  );
};

export default Header;
