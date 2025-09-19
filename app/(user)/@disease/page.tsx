"use client";

import Image from "next/image";
import React, { useState } from "react";

import { MdChevronRight } from "react-icons/md";
import DiseaseModal from "@/components/modals/DiseaseModal";
import { isNative, bananaDiseases, BananaDiseaseType } from "@/lib/constant";

function Page() {
  const [selectedDisease, setSelectedDisease] =
    useState<BananaDiseaseType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBananaDisease = bananaDiseases.filter(
    (disease) => disease.id !== "healthy" && disease.id !== "not-banana",
  );

  const handleLearnMore = (disease: any) => {
    setSelectedDisease(disease);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDisease(null);
  };

  function shortenText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Fungal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Viral":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Bacterial":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pest":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <section
      className={`flex scroll-m-16 flex-col items-center justify-center gap-8 px-4 md:px-10 lg:px-28 ${isNative ? "mt-6 pb-24" : "mt-16 mb-16"}`}
      id="disease"
    >
      {/* Header Section */}
      <div className="max-w-4xl text-center">
        <div className="flex items-center justify-center">
          <h2 className="font-clash-grotesk text-primary text-2xl font-semibold md:text-4xl">
            <span className="text-secondary">Banana</span> Disease Guide
          </h2>
        </div>
        <p className="text-sm font-light md:text-base">
          Comprehensive guide to identify, understand, and manage common banana
          diseases.
        </p>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredBananaDisease.map((disease, index) => (
          <div
            key={index}
            className="bg-primary/80 hover:shadow-2x h-full rounded-md p-4 hover:-translate-y-2"
          >
            <div className="group flex h-full transform flex-col overflow-hidden rounded-md bg-white shadow-lg transition-all duration-300">
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={disease.imgUrl || ""}
                  fill
                  alt={disease.name || ""}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Severity Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getSeverityColor(disease.severity || "")}`}
                  >
                    {disease.severity} Risk
                  </span>
                </div>

                {/* Type Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getTypeColor(disease.type || "")}`}
                  >
                    {disease.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-grow flex-col p-6">
                <h3 className="group-hover:text-primary mb-3 text-xl font-bold text-gray-900 transition-colors duration-200">
                  {disease.name || ""}
                </h3>

                {/* Key Symptoms */}
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-semibold text-gray-700">
                    Key Symptoms:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {disease?.symptoms?.slice(0, 2).map((symptom, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
                      >
                        {symptom}
                      </span>
                    ))}
                    {disease?.symptoms && disease.symptoms.length > 2 && (
                      <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs">
                        +{disease.symptoms.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <p className="mb-6 text-justify text-sm leading-relaxed text-gray-600">
                  {shortenText(disease.description || "", 300)}
                </p>

                {/* Learn More Button */}
                <button
                  onClick={() => handleLearnMore(disease)}
                  className="bg-primary hover:bg-primary/90 group mt-auto flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 hover:cursor-pointer"
                >
                  Learn More
                  <MdChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DiseaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        disease={selectedDisease}
      />
    </section>
  );
}

export default Page;
