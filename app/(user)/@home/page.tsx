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
import { useTranslations } from "next-intl";

import PlatformWrapper from "@/components/wrapper/PlatformWrapper";
import ScanForm from "@/components/user/ScanForm";
import Guide from "@/components/user/Guide";
import { isNative } from "@/lib/constant";
import AdminButton from "@/components/admin/AdminButton";
import { Bell, FolderSync } from "lucide-react";
import SyncDashboard from "@/components/user/SyncDashboard";

function Page() {
  const t = useTranslations("home");

  const features = [
    {
      icon: RiSparklingLine,
      title: t("features.items.0.title"),
      description: t("features.items.0.description"),
    },
    {
      icon: RiShieldCheckLine,
      title: t("features.items.1.title"),
      description: t("features.items.1.description"),
    },
    {
      icon: RiBarChartLine,
      title: t("features.items.2.title"),
      description: t("features.items.2.description"),
    },
  ];

  return (
    <section
      className={`bg-image relative flex min-h-[80vh] flex-1 scroll-mt-20 flex-col px-4 ${isNative ? "pb-10" : ""}`}
      id="home"
    >
      {isNative && (
        <PlatformWrapper
          title={t("syncManager")}
          trigger={
            <div className="bg-primary absolute top-6 right-3 z-[99] flex h-10 w-10 items-center justify-center rounded-full">
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
            {t("heading.main")}
            <br />
            <span className="text-secondary">{t("heading.highlight")}</span>
          </h1>

          <p className="mx-auto max-w-3xl text-base leading-relaxed text-white/90 md:text-lg">
            {t("description.intro")}
            <span className="text-secondary font-semibold">
              {" "}
              {t("description.highlight")}
            </span>{" "}
            {t("description.outro")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row md:w-[60%] md:gap-4 md:px-10">
          {/* Primary Scan Button */}
          <PlatformWrapper
            title={t("buttons.scanTitle")}
            trigger={
              <button className="group bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-3 rounded-xl px-4 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl sm:flex-1">
                <RiCameraLine className="h-6 w-6" />
                {t("buttons.startScanning")}
                <RiArrowRightSLine className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            }
          >
            <ScanForm />
          </PlatformWrapper>

          {/* Secondary Guide Button */}
          <PlatformWrapper
            title={t("buttons.guideTitle")}
            trigger={
              <button className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-white/30 bg-white/10 px-4 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 sm:flex-1">
                <RiBookOpenLine className="h-6 w-6" />
                {t("buttons.viewGuide")}
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
            {t("features.title")}
          </p>
          <p className="text-light text-base md:text-lg">
            {t("features.subtitle")}
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
          <p className="text-light">{t("tagline")}</p>
        </div>
      </div>
    </section>
  );
}

export default Page;
