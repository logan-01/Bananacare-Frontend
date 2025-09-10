"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
// import {
//   MdChevronLeft,
//   MdPerson,
// } from "@heroicons/react/24/outline";

import { MdChevronRight, MdPerson } from "react-icons/md";

import DiseaseModal from "@/components/modals/DiseaseModal";
import { isNative } from "@/lib/constant";
import { div } from "@tensorflow/tfjs";

const diseases = [
  {
    title: "Banana Black Sigatoka Disease",
    image: "/img/Banana-Black-Sigatoka.jpg",
    description:
      "Black Sigatoka, also known as black leaf streak, is a serious fungal disease caused by Mycosphaerella fijiensis. It primarily affects the leaves of banana plants, leading to dark streaks or spots that expand and coalesce, ultimately causing large areas of leaf necrosis. The disease reduces the photosynthetic area of the plant, which directly results in a significant decline in fruit yield and quality. It spreads through airborne spores and thrives in humid tropical climates, requiring rigorous management including fungicide application and resistant cultivars.",
    severity: "High",
    type: "Fungal",
    symptoms: ["Dark streaks on leaves", "Leaf necrosis", "Reduced yield"],
  },
  {
    title: "Banana Cordana Disease",
    image: "/img/Banana-Cordana.jpg",
    description:
      "Cordana leaf spot is caused by the fungus Cordana musae. This disease is characterized by the appearance of brown to dark brown elliptical or irregular spots on banana leaves, often surrounded by yellow halos. Over time, these lesions may enlarge and merge, reducing the photosynthetic area. While it is generally considered less severe than other banana leaf diseases, heavy infestations can stress the plant and lead to decreased productivity. Proper field sanitation and fungicide treatments can help manage its spread.",
    severity: "Medium",
    type: "Fungal",
    symptoms: [
      "Brown spots with yellow halos",
      "Lesion enlargement",
      "Reduced photosynthesis",
    ],
  },
  {
    title: "Banana Bract Mosaic Virus Disease",
    image: "/img/Banana-Bract-Mosaic-Virus.jpg",
    description:
      "Bract Mosaic Disease is a viral infection caused by a Potyvirus, often transmitted by aphids, particularly Pentalonia nigronervosa. The disease is identified by mosaic patterns, spindle-shaped streaks, and sometimes distortion on the leaves, bracts, and flowers of the banana plant. It can severely affect plant growth and reduce fruit yield. Since it is transmitted by insect vectors, controlling aphid populations and using virus-free planting materials are key strategies for disease management.",
    severity: "High",
    type: "Viral",
    symptoms: ["Mosaic patterns", "Leaf distortion", "Growth reduction"],
  },
  {
    title: "Banana Moko Disease",
    image: "/img/Banana-Moko.jpg",
    description:
      "Moko disease is a lethal bacterial infection caused by Ralstonia solanacearum (race 2). It invades the vascular system of the banana plant, leading to internal vascular discoloration (browning), wilting of the leaves, and the eventual collapse of the plant. External symptoms include premature yellowing and wilting of the leaves, while internally, the pseudostem and fruit show darkened vascular strands. It is spread through contaminated tools, infected planting materials, and insect vectors, making proper sanitation and control measures critical.",
    severity: "Critical",
    type: "Bacterial",
    symptoms: ["Vascular browning", "Wilting leaves", "Plant collapse"],
  },
  {
    title: "Banana Panama Disease",
    image: "/img/Banana-Panama.jpg",
    description:
      "Panama Disease, or Fusarium wilt, is a devastating soil-borne fungal disease caused by Fusarium oxysporum f. sp. cubense (Foc). It attacks the banana plant's vascular system, leading to yellowing and wilting of older leaves, which eventually collapse around the pseudostem. The internal tissues show reddish-brown discoloration. The fungus can persist in the soil for decades, making it extremely difficult to eradicate. Management includes using resistant cultivars, crop rotation, and strict quarantine measures.",
    severity: "Critical",
    type: "Fungal",
    symptoms: [
      "Leaf yellowing",
      "Vascular discoloration",
      "Long-term soil persistence",
    ],
  },
  {
    title: "Banana Weevil Disease",
    image: "/img/Banana-Weevil.jpg",
    description:
      "Banana weevil infestation, caused by Cosmopolites sordidus, is a major pest problem in banana cultivation. Adult weevils lay eggs near the base of the banana plant, and the emerging larvae bore into the pseudostem and rhizome, creating extensive galleries that damage the plant's internal tissues. This damage impairs nutrient and water transport, weakens the plant structure, and can lead to toppling and reduced fruit production. Integrated pest management strategies such as trapping, use of resistant varieties, and biological control are used to combat this pest.",
    severity: "High",
    type: "Pest",
    symptoms: [
      "Internal galleries",
      "Weakened structure",
      "Reduced production",
    ],
  },
];

function Page() {
  const { data: session } = useSession();
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      className={`flex h-full w-full scroll-m-16 flex-col items-center justify-center gap-8 px-6 md:px-10 lg:px-28 ${isNative ? "mt-4 pb-20" : "mt-16 mb-16"}`}
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
        {diseases.map((disease, index) => (
          <div
            key={index}
            className="bg-primary/80 hover:shadow-2x h-full rounded-md p-4 hover:-translate-y-2"
          >
            <div className="group flex h-full transform flex-col overflow-hidden rounded-md bg-white shadow-lg transition-all duration-300">
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={disease.image}
                  fill
                  alt={disease.title}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Severity Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getSeverityColor(disease.severity)}`}
                  >
                    {disease.severity} Risk
                  </span>
                </div>

                {/* Type Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getTypeColor(disease.type)}`}
                  >
                    {disease.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-grow flex-col p-6">
                <h3 className="group-hover:text-primary mb-3 text-xl font-bold text-gray-900 transition-colors duration-200">
                  {disease.title}
                </h3>

                {/* Key Symptoms */}
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-semibold text-gray-700">
                    Key Symptoms:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {disease.symptoms.slice(0, 2).map((symptom, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
                      >
                        {symptom}
                      </span>
                    ))}
                    {disease.symptoms.length > 2 && (
                      <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs">
                        +{disease.symptoms.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <p className="mb-6 text-justify text-sm leading-relaxed text-gray-600">
                  {shortenText(disease.description, 120)}
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
        session={session}
      />
    </section>
  );
}

export default Page;
