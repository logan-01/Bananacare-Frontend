"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";

import {
  RiVirusLine,
  RiHome5Line,
  RiInformationLine,
  RiContactsLine,
  RiDownloadLine,
  RiCloseLine,
} from "react-icons/ri";

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
import PlatformWrapper from "../wrapper/PlatformWrapper";
import DownloadPage from "./DownloadPage";

function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<string>("home");
  const menuRef = useRef<HTMLDivElement>(null);
  // const { data: session, status } = useSession();

  const navItems = [
    { label: "Home", icon: RiHome5Line, key: "home" },
    { label: "Disease", icon: RiVirusLine, key: "disease" },
    { label: "About", icon: RiInformationLine, key: "about" },
    { label: "Contact", icon: RiContactsLine, key: "contact" },
  ];

  const sectionIds = ["home", "disease", "about", "contact"];

  // Handle scroll detection for active nav
  useEffect(() => {
    const handleScroll = () => {
      let currentSection = activeNav;

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
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

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setActiveNav(id);
    setIsMenuOpen(false); // Close menu after navigation
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Menu Toggle Button */}
      <nav className="flex flex-1 items-center justify-end md:hidden">
        <button
          onClick={toggleMenu}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center rounded-lg transition-colors duration-200"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {/* Animated Hamburger/X Icon */}
          <span
            className={`bg-primary block h-0.5 w-6 transform rounded-full transition-all duration-300 ${
              isMenuOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`bg-primary block h-0.5 w-6 transform rounded-full transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`bg-primary block h-0.5 w-6 transform rounded-full transition-all duration-300 ${
              isMenuOpen ? "-translate-y-0 -rotate-45" : "translate-y-1.5"
            }`}
          />
        </button>
      </nav>

      {/* Backdrop Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sliding Side Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 z-50 flex h-screen w-80 max-w-[85vw] transform flex-col bg-white transition-transform duration-300 ease-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <Image
              src="/img/BananaCare-Logomark.svg"
              width={40}
              height={40}
              alt="BananaCare Logomark"
              className="rounded-lg"
            />
            <Image
              src="/img/BananaCare-Wordmark.svg"
              width={120}
              height={40}
              alt="BananaCare Wordmark"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="p-4">
            <p className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Navigation
            </p>

            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.key}>
                  <button
                    onClick={() => handleNavClick(item.key)}
                    className={`hover:bg-primary/10 focus:ring-primary flex w-full items-center gap-3 rounded-md px-4 py-3 text-left font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                      activeNav === item.key
                        ? "bg-primary text-white shadow-lg"
                        : "hover:text-primary text-gray-700"
                    }`}
                    aria-current={activeNav === item.key ? "page" : undefined}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        activeNav === item.key ? "text-white" : "text-gray-500"
                      }`}
                    />
                    <span className="text-sm">{item.label}</span>

                    {/* Active indicator */}
                    {activeNav === item.key && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-white/30" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Actions */}
          <div className="mt-auto border-t border-gray-100 p-4">
            <PlatformWrapper
              title="Download App"
              trigger={
                <button className="bg-primary hover:bg-primary/90 focus:ring-primary flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95">
                  <RiDownloadLine className="h-5 w-5" />
                  <span>Download App</span>
                </button>
              }
            >
              <DownloadPage />
            </PlatformWrapper>
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileNav;
