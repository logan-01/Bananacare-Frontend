"use client";

import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { isNative } from "@/lib/constant";

function Page() {
  const t = useTranslations("about");

  // Get the cards array from translations
  const aboutCards = t.raw("cards");

  return (
    <section
      className={`flex scroll-mt-20 flex-col items-center gap-8 px-4 md:px-10 lg:px-28 ${isNative ? "mt-6 pb-24" : "mb-16"}`}
      id="about"
    >
      {/* Header Section */}
      <div className="mx-auto max-w-4xl text-center">
        <div className="flex items-center justify-center">
          <h2 className="font-clash-grotesk text-primary text-2xl font-semibold md:text-4xl">
            <span className="text-secondary">{t("header.title")} </span>{" "}
            {t("header.highlight")}
          </h2>
        </div>
        <p className="text-sm font-light md:text-base">
          {t("header.subtitle")}
        </p>
      </div>

      {/* Main Cards Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-8 rounded-md lg:grid-cols-3">
        {aboutCards.map((card: any, index: number) => (
          <div key={index} className="bg-primary rounded-md p-4">
            <div className="group relative flex h-full flex-col overflow-hidden rounded-md border border-gray-100 bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              {/* Floating Icon */}
              <div className="relative mb-6 flex justify-center pt-8">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110">
                    <Image
                      src={card.icon}
                      width={80}
                      height={80}
                      alt={card.title}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  {/* Glow Effect */}
                  <div className="bg-primary/20 absolute inset-0 rounded-2xl opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-50" />
                </div>
              </div>

              {/* Content */}
              <div className="relative p-8 pt-0">
                {/* Badge */}
                <div className="bg-primary/10 text-primary mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold">
                  {card.subtitle}
                </div>

                {/* Title */}
                <h3 className="group-hover:text-primary mb-4 text-xl font-bold text-gray-900 transition-colors duration-300">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="mb-6 text-justify text-sm leading-relaxed text-gray-600">
                  {card.description}
                </p>

                {/* Features List */}
                <div className="space-y-3">
                  <h4 className="mb-3 text-sm font-semibold text-gray-900">
                    {card.featuresTitle}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {card.features.map(
                      (feature: string, featureIndex: number) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-3 rounded-lg p-2 transition-colors duration-200 hover:bg-gray-50"
                        >
                          <div className="bg-primary h-2 w-2 flex-shrink-0 rounded-full" />
                          <span className="text-sm font-medium text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="bg-primary absolute right-0 bottom-0 left-0 h-1 scale-x-0 transform bg-gradient-to-r transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Page;
