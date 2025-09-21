"use client";

import React, { useState, useEffect, useRef } from "react";
import PlatformWrapper from "../wrapper/PlatformWrapper";
import DownloadPage from "./DownloadPage";
import { RiDownloadLine } from "react-icons/ri";

function DesktopNav() {
  const sectionIds = ["home", "disease", "about", "contact"];
  const [activeNav, setActiveNav] = useState<string>("home");
  const activeNavRef = useRef(activeNav);
  useEffect(() => {
    const handleScroll = () => {
      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          ) {
            if (activeNavRef.current !== id) {
              activeNavRef.current = id;
              setActiveNav(id);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setActiveNav(id);
    activeNavRef.current = id;
  };

  return (
    <ul className="hidden flex-1 flex-row items-center justify-end gap-4 font-semibold md:flex">
      {sectionIds.map((id) => (
        <li
          key={id}
          className={`hover:text-primary whitespace-nowrap hover:cursor-pointer ${
            activeNav === id ? "text-primary" : "text-dark"
          }`}
          onClick={() => handleNavClick(id)}
        >
          {id === "contact"
            ? "Contact Us"
            : id.charAt(0).toUpperCase() + id.slice(1)}
        </li>
      ))}

      <PlatformWrapper
        title="Download App"
        trigger={
          <button
            className="bg-primary text-light flex items-center gap-2 rounded-md px-4 py-2 font-medium hover:cursor-pointer hover:opacity-70"
            onClick={() => handleNavClick("scan")}
          >
            <RiDownloadLine className="h-5 w-5" />
            <span>Download</span>
          </button>
        }
      >
        <DownloadPage />
      </PlatformWrapper>
    </ul>
  );
}

export default DesktopNav;
