import React, { useState, useEffect, useRef } from "react";
import {
  RiVirusLine,
  RiHome5Line,
  RiInformationLine,
  RiContactsLine,
} from "react-icons/ri";
import { AiOutlineScan } from "react-icons/ai";

import Image from "next/image";
import PlatformWrapper from "../wrapper/PlatformWrapper";
import ScanForm from "./ScanForm";

interface BottomNavProps {
  activeTab: "home" | "disease" | "about" | "contact" | "scan";
  onChangeTab: (tab: "home" | "disease" | "about" | "contact" | "scan") => void;
}

const navItems = [
  { label: "Home", icon: RiHome5Line, key: "home" },
  { label: "Disease", icon: RiVirusLine, key: "disease" },
  { label: "Scan", icon: AiOutlineScan, key: "scan" },
  { label: "About", icon: RiInformationLine, key: "about" },
  {
    label: "Contact",
    icon: RiContactsLine,
    key: "contact",
  },
];

function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const [showScanModal, setShowScanModal] = useState(false);

  const handleNavItemClick = (key: string) => {
    if (key === "scan") {
      setShowScanModal(true);
      onChangeTab("scan");
    } else {
      setShowScanModal(false);
      onChangeTab(key as any);
    }
  };

  return (
    <>
      <div className="bg-light fixed bottom-0 z-[9999] mt-20 flex w-screen px-2 py-2 shadow-md drop-shadow-md">
        {navItems.map((item, index) => (
          <div
            className={`flex flex-1 flex-col items-center justify-center ${activeTab === item.key ? "" : ""}`}
            key={index}
            onClick={() => handleNavItemClick(item.key)}
          >
            <item.icon
              className={`h-full text-2xl ${item.key === "scan" ? "pointer-events-none opacity-0" : ""} ${activeTab === item.key ? "text-primary" : "text-gray-400"}`}
            />

            <p
              className={`text-[10px] font-medium ${
                activeTab === item.key ? "text-primary" : "text-gray-400"
              }`}
            >
              {item.label}
            </p>

            {/* Scan Form Button */}
            {item.key === "scan" && (
              <div
                className="from-primary to-primary/90 absolute -top-7 flex h-[56px] w-[56px] cursor-pointer items-center justify-center rounded-full bg-gradient-to-br shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                onClick={(e) => {
                  // e.stopPropagation();
                  setShowScanModal(true);
                }}
              >
                {!showScanModal && (
                  <>
                    <div className="bg-primary/20 absolute h-14 w-14 animate-ping rounded-full"></div>
                    <div className="bg-primary/30 absolute h-12 w-12 animate-pulse rounded-full"></div>
                  </>
                )}

                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
                  <item.icon className="text-primary text-xl" />

                  {/* <Image
                    src={"/img/BananaCare-Logomark.svg"}
                    width={25}
                    height={25}
                    alt="Banacare Lo"
                  /> */}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <PlatformWrapper
        open={showScanModal}
        onOpenChange={setShowScanModal}
        title="Scan Banana"
        nativeTitleClass="text-center  w-full"
        showBackButton={false}
      >
        <ScanForm />
      </PlatformWrapper>
    </>
  );
}

export default BottomNav;
