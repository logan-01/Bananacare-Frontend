"use client";

import React, { useState, useEffect, useRef } from "react";

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

      <button
        className="bg-primary text-light rounded-md px-4 py-2 font-medium hover:cursor-pointer hover:opacity-70"
        onClick={() => handleNavClick("scan")}
      >
        Download
      </button>
    </ul>
  );
}

export default DesktopNav;
