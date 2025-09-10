import React from "react";
import Image from "next/image";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

function Navbar() {
  return (
    <header className="bg-light sticky top-0 z-50 flex w-full px-6 py-2 md:px-10 lg:px-28">
      <div className="flex flex-1 items-center gap-2">
        <Image
          src="/img/BananaCare-Logomark.svg"
          width={50}
          height={50}
          alt="BananaCare Logomark"
        />

        <Image
          src="/img/BananaCare-Wordmark.svg"
          width={130}
          height={60}
          alt="BananaCare Wordmark"
        />
      </div>

      <DesktopNav />
      <MobileNav />
    </header>
  );
}

export default Navbar;
