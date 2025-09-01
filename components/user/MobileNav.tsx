"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

import {
  RiVirusLine,
  RiHome5Line,
  RiInformationLine,
  RiContactsLine,
} from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

function MobileNav() {
  const [activeNav, setActiveNav] = useState<string>("home");
  const checkboxRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();

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

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = activeNav;

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          // Check if the section is at least partially in view
          if (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          ) {
            currentSection = id;
            break;
          }
        }
      }

      if (currentSection !== activeNav) {
        setActiveNav(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeNav]);

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setActiveNav(id);
  };

  const onLogout = async () => {
    await signOut();
  };

  return (
    <nav className="flex flex-1 items-center justify-end md:hidden">
      <label className="flex w-8 flex-col gap-2">
        {/* Hamburger Menu */}
        <input className="peer hidden" type="checkbox" ref={checkboxRef} />
        <div className="bg-primary h-[3px] w-1/2 origin-right rounded-2xl duration-500 peer-checked:-translate-x-[12px] peer-checked:-translate-y-[1px] peer-checked:rotate-[225deg]"></div>
        <div className="bg-primary h-[3px] w-full rounded-2xl duration-500 peer-checked:-rotate-45"></div>
        <div className="bg-primary h-[3px] w-1/2 origin-left place-self-end rounded-2xl duration-500 peer-checked:translate-x-[12px] peer-checked:translate-y-[1px] peer-checked:rotate-[225deg]"></div>

        {/* Overlay */}
        <div className="pointer-events-none fixed inset-0 h-screen w-screen opacity-0 transition-opacity duration-300 peer-checked:pointer-events-auto peer-checked:bg-black/50 peer-checked:opacity-100"></div>

        {/* Sliding Side Menu */}
        <div className="bg-light fixed top-0 left-0 z-40 flex h-screen w-[18rem] -translate-x-full flex-col px-3 transition-transform duration-500 ease-in-out peer-checked:translate-x-0">
          <div className="flex items-center gap-2 py-2">
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

          <ul className="flex flex-1 flex-col gap-1 py-4">
            <p className="text-primary py-1 text-xs font-medium">Menu</p>

            {navItems.map((item) => (
              <li
                key={item.key}
                className={`hover:bg-primary hover:text-light flex items-center gap-2 rounded-md px-2 py-3 font-medium whitespace-nowrap hover:cursor-pointer ${
                  activeNav === item.key ? "bg-primary text-light" : "text-dark"
                }`}
                onClick={() => handleNavClick(item.key)}
              >
                <item.icon className="" />
                <p className="text-sm">{item.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </label>
    </nav>
  );
}

export default MobileNav;
