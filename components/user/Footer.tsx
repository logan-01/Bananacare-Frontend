"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MdOutlineEmail, MdPhone, MdLocationOn } from "react-icons/md";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

function Footer() {
  const sectionIds = ["home", "disease", "about", "contact"];
  const [activeNav, setActiveNav] = useState<string>("home");
  const [email, setEmail] = useState<string>("");
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-slate-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <Image
                src="/img/BananaCare-Logomark.svg"
                width={40}
                height={40}
                alt="BananaCare Logomark"
              />
              <Image
                src="/img/BananaCare-Wordmark.svg"
                width={120}
                height={50}
                alt="BananaCare Wordmark"
              />
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Advanced AI-powered banana disease detection system helping
              farmers protect their crops and improve agricultural
              sustainability.
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:bg-primary rounded-lg bg-slate-800 p-2 transition-colors duration-200"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="hover:bg-primary rounded-lg bg-slate-800 p-2 transition-colors duration-200"
              >
                <FaTwitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="hover:bg-primary rounded-lg bg-slate-800 p-2 transition-colors duration-200"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="hover:bg-primary rounded-lg bg-slate-800 p-2 transition-colors duration-200"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {sectionIds.map((id) => (
                <li key={id}>
                  <button
                    onClick={() => handleNavClick(id)}
                    className="hover:text-primary text-sm text-gray-400 transition-colors duration-200"
                  >
                    {id === "contact"
                      ? "Contact Us"
                      : id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-primary text-gray-400 transition-colors duration-200"
                >
                  Disease Detection
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary text-gray-400 transition-colors duration-200"
                >
                  Crop Analysis
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary text-gray-400 transition-colors duration-200"
                >
                  Agricultural Consulting
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary text-gray-400 transition-colors duration-200"
                >
                  Mobile App Support
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">
              Stay Updated
            </h3>
            <p className="mb-4 text-sm text-gray-400">
              Get the latest updates about banana disease prevention and
              agricultural insights.
            </p>

            {/* Newsletter Subscription */}
            <form onSubmit={handleSubscribe} className="mb-6">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <MdOutlineEmail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="focus:border-primary w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pr-4 pl-10 text-white placeholder-gray-500 transition-colors duration-200 focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 rounded-lg px-6 py-2.5 font-medium text-white transition-colors duration-200"
                >
                  Subscribe
                </button>
              </div>
            </form>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-400">
                <MdPhone className="text-primary h-4 w-4 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MdOutlineEmail className="text-primary h-4 w-4 flex-shrink-0" />
                <span>support@bananacare.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MdLocationOn className="text-primary h-4 w-4 flex-shrink-0" />
                <span>Agricultural Tech Center, Innovation District</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center text-sm text-gray-400 sm:text-left">
              © 2024{" "}
              <span className="text-primary font-medium">
                Banana<span className="text-secondary">Care</span>
              </span>
              . All rights reserved.
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm sm:justify-end">
              <a
                href="#"
                className="hover:text-primary text-gray-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-primary text-gray-400 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-primary text-gray-400 transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
