import React, { useState, useEffect, useRef } from "react";
import {
  RiVirusLine,
  RiHome5Line,
  RiInformationLine,
  RiContactsLine,
} from "react-icons/ri";

function BottomNav() {
  const navItems = [
    { label: "Home", icon: RiHome5Line, key: "home" },
    { label: "Disease", icon: RiVirusLine, key: "disease" },
    { label: "About", icon: RiInformationLine, key: "about" },
    {
      label: "Contact",
      icon: RiContactsLine,
      key: "contact",
    },
  ];
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
    <div className="bg-light fixed bottom-0 z-40 flex h-12 w-screen px-2 drop-shadow-md">
      {navItems.map((item, index) => (
        <div
          className={`flex flex-1 flex-col items-center justify-center py-[5px] ${activeNav === item.key ? "bg-primary/20" : ""}`}
          key={index}
          onClick={() => handleNavClick(item.key)}
        >
          <item.icon className="text-primary h-full text-2xl" />
          <p className="text-[10px]">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default BottomNav;
