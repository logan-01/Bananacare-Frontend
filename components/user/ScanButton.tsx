"use client";

import React, { useEffect, useState } from "react";
import { LuScanLine } from "react-icons/lu";

import PlatformWrapper from "../wrapper/PlatformWrapper";
import ScanForm from "./ScanForm";

function ScanButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById("home");
      if (homeSection) {
        const rect = homeSection.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0; // in viewport

        setShowButton(!isVisible); // show when NOT visible
      }
    };

    handleScroll(); // run on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showButton) return null;

  return (
    <>
      <>
        <div className="bg-primary/20 fixed right-5 bottom-[60px] z-50 flex h-[50px] w-[50px] animate-ping rounded-full"></div>
        <div className="bg-primary/30 fixed right-5 bottom-[60px] z-50 flex h-[48px] w-[48px] animate-pulse rounded-full"></div>
      </>

      <div className="bg-primary fixed right-5 bottom-[60px] z-50 flex h-[50px] w-[50px] items-center justify-center rounded-full shadow-lg hover:cursor-pointer hover:opacity-70">
        {/* <ScanModal trigger={<LuScanLine className="text-light text-2xl" />} /> */}
        <PlatformWrapper
          title="Scan Banana"
          trigger={<LuScanLine className="text-light text-2xl" />}
        >
          <ScanForm />
        </PlatformWrapper>
      </div>
    </>
  );
}

export default ScanButton;
