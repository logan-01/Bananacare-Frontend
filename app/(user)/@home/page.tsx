"use client";

import React from "react";
import {
  RiCameraLine,
  RiBookOpenLine,
  RiArrowRightSLine,
  RiShieldCheckLine,
  RiSparklingLine,
  RiBarChartLine,
} from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";

import PlatformWrapper from "@/components/wrapper/PlatformWrapper";
import ScanForm from "@/components/user/ScanForm";
import Guide from "@/components/user/Guide";
import { isNative } from "@/lib/constant";
import AdminButton from "@/components/admin/AdminButton";
import { Bell, FolderSync } from "lucide-react";
import SyncDashboard from "@/components/user/SyncDashboard";

function page() {
  const features = [
    {
      icon: RiSparklingLine,
      title: "AI-Powered",
      description: "Advanced machine learning for accurate disease detection",
    },
    {
      icon: RiShieldCheckLine,
      title: "Instant Results",
      description: "Get diagnosis and treatment recommendations in seconds",
    },
    {
      icon: RiBarChartLine,
      title: "Crop Protection",
      description: "Protect your harvest and maximize yield potential",
    },
  ];

  return (
    <section
      className={`bg-image relative flex min-h-[80vh] flex-1 scroll-mt-20 flex-col px-4 ${isNative ? "pb-10" : ""}`}
      id="home"
    >
      {isNative && (
        <PlatformWrapper
          title="Sync Manager"
          trigger={
            <div className="bg-primary absolute top-6 right-3 z-[99] flex h-10 w-10 items-center justify-center rounded-full">
              {" "}
              <FolderSync className="text-light h-6 w-6" />
            </div>
          }
        >
          <SyncDashboard />
        </PlatformWrapper>
      )}

      {/* Main */}
      <div className="relative mt-0 flex h-[90vh] flex-col items-center justify-center gap-4 md:mt-0 md:pb-0">
        {/* Main Heading */}
        <div className="flex flex-col items-center justify-center gap-2 text-center md:w-[60%]">
          {/* Hidden Button to Navigate Admin */}
          <AdminButton />

          <h1 className="font-clash-grotesk text-3xl font-semibold text-white md:text-6xl lg:text-6xl">
            Detect Banana Disease
            <br />
            <span className="text-secondary">with Precision</span>
          </h1>

          <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/90 md:text-lg">
            Revolutionary AI technology that identifies banana diseases
            instantly.
            <span className="text-secondary font-semibold">
              {" "}
              Snap, analyze, and protect
            </span>{" "}
            your crops with professional-grade diagnostics in the palm of your
            hand.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row md:w-[60%] md:gap-4 md:px-10">
          {/* Primary Scan Button */}
          <PlatformWrapper
            title="Scan Banana Disease"
            trigger={
              <button className="group bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-3 rounded-xl px-4 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl sm:flex-1">
                <RiCameraLine className="h-6 w-6" />
                Start Scanning
                <RiArrowRightSLine className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            }
          >
            <ScanForm />
          </PlatformWrapper>

          {/* Secondary Guide Button */}
          <PlatformWrapper
            title="Capturing Guide"
            trigger={
              <button className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-white/30 bg-white/10 px-4 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 sm:flex-1">
                <RiBookOpenLine className="h-6 w-6" />
                View Guide
                <RiArrowRightSLine className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            }
          >
            <Guide />
          </PlatformWrapper>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 transform animate-bounce md:top-auto md:bottom-22">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30">
            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white/50" />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="flex flex-col items-center justify-center pb-20">
        {/* Feature Heading */}
        <div className="text-center">
          <p className="text-secondary font-clash-grotesk text-3xl font-semibold md:text-5xl">
            Features
          </p>
          <p className="text-light text-base md:text-lg">
            Discover What Makes BananaCare Smarter
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/20"
            >
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className="bg-primary/20 rounded-full p-3">
                  <feature.icon className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/80">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-10">
          <FaCheck className="text-primary text-xl" />
          <p className="text-light">Scan. Detect. Protect.</p>
        </div>
      </div>
    </section>
  );
}

export default page;
